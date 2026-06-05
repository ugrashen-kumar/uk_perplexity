import nodemailer from 'nodemailer'


const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        type : "OAuth2",
        clientId : process.env.GOOGLE_CLIENT_ID,
        clientSecret : process.env.GOOGLE_CLIENT_SECRET,
        refreshToken : process.env.GOOGLE_REFRESH_TOKEN,
        user : process.env.GOOGLE_USER
    }
})

transporter.verify()
.then(()=>{
    console.log("Server is connected to SMPT server")
})
.catch((err)=>{
    console.error(err)
})


export const sendEmail = async({to, subject, html, text}) =>{
    const mailOptions = {
        from : process.env.GOOGLE_USER,
        to,
        subject,
        html,
        text
    }

    const details = await transporter.sendMail(mailOptions)

    console.log("Email Sent", mailOptions)
}