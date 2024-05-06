import axios from "axios";


const API_KEY = "ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2T1RjeU5EYzVMQ0p1WVcxbElqb2lhVzVwZEdsaGJDSjkuUEYwRTdHMDBGTnNWdkJHT1V0TDJ4MEdMMHVfWkJWbF9QdWI5bkxiRmQ1MVI0Mnh2MXFvRFNvZmVMd3NQNk1KTnFtTzdTSXpmU0JrTTh0M21JN0dHNVE=" ; // Your API key
const MERCHANT_ID = ""; // Your merchant ID
const CARD_INTEGRATION_ID = ""; // Your card integration ID
const paymentController = async(req,res)=>{

    try{
        
        const token = await getToken();
        //console.log('Token:', token);
        const orderId = await getOrderId(token);
        //console.log('Order ID:', orderId);
        const paymentKey = await getPaymentKey(token, orderId);
        //console.log('Payment key:', paymentKey);
        const paymentResponse = await makePayment(paymentKey);

        console.log('Payment successful:', paymentResponse);


        res.status(200).json({message:"Payment Successful"})
    }catch(err){
        console.log(err.message) ;
        res.status(500).json({message:"Payment Failed"})
    }
}
const getToken = async () => {
    const response = await axios.post('https://accept.paymob.com/api/auth/tokens', {
        api_key: API_KEY
    });
    return response.data.token;
};
const getOrderId = async (authToken) => {
    const response = await axios.post('https://accept.paymob.com/api/ecommerce/orders', {
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: '100', // Replace with actual amount
        items : [] , // Add items here...
        // merchant_id: MERCHANT_ID
    });
    return response.data.id;
}
const getPaymentKey = async (authToken, orderId) => {
    const response = await axios.post('https://accept.paymob.com/api/acceptance/payment_keys', {
            auth_token: authToken,
            amount_cents: '100', // Replace with actual amount
            expiration: 3600,
            order_id: orderId,
            billing_data: {
                "apartment": "803", 
                "email": "claudette09@exa.com", 
                "floor": "42", 
                "first_name": "Clifford", 
                "street": "Ethan Land", 
                "building": "8028", 
                "phone_number": "01010101010", 
                "shipping_method": "PKG", 
                "postal_code": "01898", 
                "city": "Jaskolskiburgh", 
                "country": "CR", 
                "last_name": "Nicolas", 
                "state": "Utah"
              } , // Add billing data here...
            currency: 'EGP',
            integration_id: 4560570,
            
    });
    return response.data.token;
}
const makePayment = async (paymentKey) => {
    const response = await axios.post('https://accept.paymob.com/api/acceptance/payments/pay', {
        source: {
            identifier: "cash", 
            subtype: "CASH" 
        },
        payment_token: paymentKey
    });
    return response.data;
}

export {
    paymentController
}