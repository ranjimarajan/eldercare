import React, { useEffect, useState } from 'react';

function Payment() {
  const [isPaymentReady, setIsPaymentReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect(() => {
    // Load required scripts dynamically if they're not already loaded
    const loadScript = (src, id) => {
      return new Promise((resolve, reject) => {
        if (document.getElementById(id)) {
          resolve();
          return;
        }
        
        const script = document.createElement('script');
        script.src = src;
        script.id = id;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };
    
    const initializePayment = async () => {
      try {
        // Load necessary scripts
        await Promise.all([
          loadScript('https://pay.google.com/gp/p/js/pay.js', 'google-pay-script'),
          loadScript('https://js.braintreegateway.com/web/3.82.0/js/client.min.js', 'braintree-client'),
          loadScript('https://js.braintreegateway.com/web/3.82.0/js/google-payment.min.js', 'braintree-google-payment')
        ]);
        
        // Give scripts a moment to initialize
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!window.google || !window.google.payments || !window.google.payments.api || !window.braintree) {
          setErrorMessage('Required payment libraries failed to load properly');
          return;
        }
        
        const paymentsClient = new window.google.payments.api.PaymentsClient({
          environment: 'TEST'
        });
        
        // Create Braintree client
        const clientInstance = await new Promise((resolve, reject) => {
          window.braintree.client.create({
            authorization: 'sandbox_d52wbnyb_7t5bdrz6q6fys95x'
          }, (err, instance) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(instance);
          });
        });
        
        // Create Google Payment instance
        const googlePaymentInstance = await new Promise((resolve, reject) => {
          window.braintree.googlePayment.create({
            client: clientInstance,
            googlePayVersion: 2
            // googleMerchantId is optional in TEST environment
          }, (err, instance) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(instance);
          });
        });
        
        // Basic configuration for isReadyToPay
        const baseRequest = {
          apiVersion: 2,
          apiVersionMinor: 0
        };
        
        // Add payment methods from Braintree
        const paymentRequest = googlePaymentInstance.createPaymentDataRequest();
        const isReadyToPayRequest = Object.assign({}, baseRequest, {
          allowedPaymentMethods: paymentRequest.allowedPaymentMethods,
          existingPaymentMethodRequired: false
        });
        
        // Check if Google Pay is ready
        const isReadyResponse = await paymentsClient.isReadyToPay(isReadyToPayRequest);
        
        if (isReadyResponse.result) {
          setIsPaymentReady(true);
          
          // Setup button handler
          setTimeout(() => {
            const button = document.getElementById('google-pay-button');
            if (button) {
              button.addEventListener('click', async (event) => {
                event.preventDefault();
                
                try {
                  const paymentDataRequest = googlePaymentInstance.createPaymentDataRequest({
                    transactionInfo: {
                      currencyCode: 'USD',
                      totalPriceStatus: 'FINAL',
                      totalPrice: '10.00'
                    }
                  });
                  
                  const paymentData = await paymentsClient.loadPaymentData(paymentDataRequest);
                  
                  // Parse the payment response
                  googlePaymentInstance.parseResponse(paymentData, (err, result) => {
                    if (err) {
                      console.error('Parse Response Error:', err.message);
                      setErrorMessage('Payment processing failed');
                      return;
                    }
                    console.log('Payment Successful:', result);
                    alert('Payment successful! Payment nonce: ' + result.nonce);
                    // Here you would send result.nonce to your server
                  });
                } catch (err) {
                  console.error('Payment failed:', err);
                  setErrorMessage(err.statusMessage || 'Payment failed');
                }
              });
            }
          }, 500);
        } else {
          setErrorMessage('Google Pay is not available on this device or browser');
        }
      } catch (error) {
        console.error('Payment initialization error:', error);
        setErrorMessage('Failed to initialize payment: ' + (error.message || 'Unknown error'));
      }
    };
    
    initializePayment();
    
    // Cleanup event listener on component unmount
    return () => {
      const button = document.getElementById('google-pay-button');
      if (button) {
        button.replaceWith(button.cloneNode(true));
      }
    };
  }, []);
  
  return (
    <div className="payment-container">
      {errorMessage ? (
        <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
          {errorMessage}
        </div>
      ) : null}
      
      <div 
        id="google-pay-button" 
        className={`google-pay-button ${isPaymentReady ? 'active' : 'disabled'}`}
        style={{ 
          cursor: isPaymentReady ? 'pointer' : 'not-allowed', 
          opacity: isPaymentReady ? 1 : 0.5,
          width: '240px',
          height: '40px',
          borderRadius: '4px',
          backgroundColor: '#000',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {isPaymentReady ? (
          <img 
            src="https://developers.google.com/pay/api/images/brand-guidelines/buy-button-white.svg" 
            alt="Google Pay"
            style={{ height: '24px' }}
          />
        ) : (
          <span style={{ color: '#fff', fontFamily: 'Arial', fontSize: '14px' }}>
            Google Pay Loading...
          </span>
        )}
      </div>
      
      {!isPaymentReady && !errorMessage && (
        <p style={{ marginTop: '10px' }}>Checking Google Pay availability...</p>
      )}
    </div>
  );
}

export default Payment;