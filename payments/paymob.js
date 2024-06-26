import axios from "axios";
import  prisma  from "../db/prisma.js";
import { createHmac } from "crypto";


const API_KEY = process.env.PAYMOB_API_KEY
const HMAC = process.env.PAYMOB_HMAC
const paymentController = async(req,res)=>{

    try{
        const task = await prisma.Tasks.findUnique({
            where : {
                id : req.body.task_id
            }
        });
        const task_price = task.price * 100;
        const token = await getToken();
        //console.log('Token:', token);
        const orderId = await getOrderId(token, req.body.task_id, task_price);
        //console.log('Order ID:', orderId);
        const paymentKey = await getPaymentKey(token, orderId, task_price, billing_data);
        //console.log('Payment key:', paymentKey);
        const payment = await prisma.Payments.create({
            data: {
                id: orderId,
                Total_amount: task.price,
            }
        });
        await prisma.Tasks.update({
            where: {
                id: req.body.task_id
            },
            data: {
                Payments_id: payment.id,
                Payments: {
                    connect: [{ id: payment.id }]
                }
            }
        })
        const link = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;

        console.log('Payment successful:', paymentResponse);


        res.status(200).json(link)
    }catch(err){
        console.log(err.message) ;
        res.status(500).json({message:"Payment Failed"})
    }
}

const paymentCallback = async(req, res) => {
    const data = req.body.obj;
    const amount_cents = data['amount_cents'];
    const created_at = data['created_at'];
    const currency = data['currency'];
    const error_occured = data['error_occured'];
    const has_parent_transaction = data['has_parent_transaction'];
    const id = data['id'];
    const integration_id = data['integration_id'];
    const is_3d_secure = data['is_3d_secure'];
    const is_auth = data['is_auth'];
    const is_capture = data['is_capture'];
    const is_refunded = data['is_refunded'];
    const is_standalone_payment = data['is_standalone_payment'];
    const is_voided = data['is_voided'];
    const order_id = data.order.id;
    const owner = data.owner;
    const pending = data.pending;
    const source_data_pan = data.source_data.pan;
    const source_data_sub_type = data.source_data.sub_type;
    data_string = amount_cents + created_at + currency + error_occured + has_parent_transaction + id + integration_id + is_3d_secure + is_auth + is_capture + is_refunded + is_standalone_payment + is_voided + order_id + owner + pending + source_data_pan + source_data_sub_type;
    hashed_data = createHmac("SHA512", process.env.PAYMOB_HMAC).update(data_string).digest("hex");
    if (hashed_data === req.query.hmac){
        const payment = await prisma.Payments.update({
            where: {
                id: req.body.obj.order.id,
            },
            data: {
                status: 1,
            }
        });
        const Task = await prisma.Tasks.findOne({
            where: {
                Payments_id: req.body.obj.order.id,
            }
        });
        const application = await prisma.Application.findOne({
            where: {
                taskId: Task.id,
                accepted: true,
            }
        });
        const task_has_emp = await prisma.Tasks_has_employee.create({
            data: {
                Tasks_id: Task.id,
                employee_id: application.employeeId,
            }
        });
    }
}

const getToken = async () => {
    try {
        const response = await axios.post('https://accept.paymob.com/api/auth/tokens', {
            api_key: API_KEY
        }, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data.token;
    } catch (error) {
        console.error("Error authenticating:", error.response.data);
    }
};
const getOrderId = async (authToken, task_id, task_price) => {
    try {
        const response = await axios.post('https://accept.paymob.com/api/ecommerce/orders', {
            auth_token: authToken,
            delivery_needed: false,
            amount_cents: task_price.toString(),
            currency: "EGP",
            items : [ task ],
        }, {
            headers: { "Content-Type": "application/json", },
        });
        return response.data.id;
    } catch (error) {
        console.error("Error creating order:", error.response.data);
    }
}
const getPaymentKey = async (authToken, orderId, task_price, billing_data) => {
    try {
        const response = await axios.post('https://accept.paymob.com/api/acceptance/payment_keys', {
            auth_token: authToken,
            amount_cents: task_price,
            expiration: 3600,
            order_id: orderId,
            billing_data,
            currency: 'EGP',
            integration_id: process.env.PAYMOB_INTEGRATION_ID,
        }, {
            headers: { "Content-Type": "application/json", },
        });
        return response.data.token;
    } catch (error){
        console.error("Error creating payment key:", error.response.data);
    }
}

export {
    paymentController,
    paymentCallback
}
