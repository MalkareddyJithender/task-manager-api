const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
console.log('WElcome email successfully sent!')

const sendWelcomeEmail = async (email,name) =>
{
   await sgMail.send({
        to:email,
        from:'jithendermalkareddy@gmail.com',
        subject:'Thanks for joining in!',
        text:`welcome to the app,${name}.`
    })
}


const sendCancelEmail = async (email,name) =>
{
await sgMail.send({
    to:email,
    from:'jithendermalkareddy@gmail.com',
    subject:'Could you please send me a feedback about your cancellation?',
    html:`<h4 style="color:orange;font-family:comic sans ms">Thank you for using this app,${name}.`
})
}

module.exports = {
sendWelcomeEmail:sendWelcomeEmail,
sendCancelEmail:sendCancelEmail
}