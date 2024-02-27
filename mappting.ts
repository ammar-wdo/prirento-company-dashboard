export const statusMap:Record<string,string> ={
    active:'bg-green-500/20 text-green-500 border border-green-500 rounded-md',
    pending:'bg-yellow-500/20 text-yellow-500 border border-yellow-500 rounded-md',

}




export const paymentMethodMap:Record<string,"card" | "paypal"> = {
    CREDIT_CARD:'card',
    PAYPAL:'paypal'
}


export const bookingStatusMap:{[key:string]:string} ={

REFUND_REQUEST:'bg-yellow-500/20 text-yellow-500 border border-yellow-500 rounded-md',
ACTIVE:'bg-green-500/20 text-green-500 border border-green-500 rounded-md',
REFUNDED:'bg-green-500/20 text-green-500 border border-green-500 rounded-md',
}