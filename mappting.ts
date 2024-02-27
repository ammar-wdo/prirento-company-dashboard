export const statusMap:Record<string,string> ={
    active:'bg-green-500/20 text-green-500 border border-green-500 rounded-md',
    pending:'bg-yellow-500/20 text-yellow-500 border border-yellow-500 rounded-md',

}


export const bookingStatusMap:Record<string,string> ={
PENDING:'bg-yellow-500/20 text-yellow-500 border border-yellow-500 rounded-md',
REFUND_REQUEST:'bg-yellow-500/20 text-yellow-500 border border-yellow-500 rounded-md',
SUCCEEDED:'bg-green-500/20 text-green-500 border border-green-500 rounded-md',
ACTIVE:'bg-green-500/20 text-green-500 border border-green-500 rounded-md',
REFUNDED:'bg-green-500/20 text-green-500 border border-green-500 rounded-md',
EXPIRED:'bg-rose-500/20 text-rose-500 border border-rose-500 rounded-md'

}


export const paymentMethodMap:Record<string,"card" | "paypal"> = {
    CREDIT_CARD:'card',
    PAYPAL:'paypal'
}