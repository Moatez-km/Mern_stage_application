const nodemailer =require('nodemailer')
const {google} =require('googleapis')
const {OAuth2} = google.auth
const OAUTH_PLAYGROUND ='https://developers.google.com/oauthplayground'


const {
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_REFRESH_TOKEN,
    SENDER_Email_ADDRESS
} = process.env

const oauth2Client = new OAuth2(
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_REFRESH_TOKEN,
    OAUTH_PLAYGROUND
)


//send email

const sendEmail = (to, url, txt)=>{
    oauth2Client.setCredentials({
        refresh_token :MAILING_SERVICE_REFRESH_TOKEN
    })

    const accessToken = oauth2Client.getAccessToken()
    const smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth : {
            type: 'OAuth2',
            user : SENDER_Email_ADDRESS,
            clientId: MAILING_SERVICE_CLIENT_ID,
            clientSecret : MAILING_SERVICE_CLIENT_SECRET,
            refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
            accessToken : accessToken

        }
    })

    const mailOptions ={
        from : SENDER_Email_ADDRESS,
        to : to ,
        subject : "Moatez Kamoun Test",
        html: `
        <div style="max-width:700px; margin:auto; border :10px solid #ddd; panding:50px 20px; font-size 100px;">
        <h2 style= "text-align: center; text-transform:uppercse; color:teal;">Welcome to our application Tek-Up_Stage</h2>
        <br><p> Congratulations ! You're almost set to start using Tek-Up_Stage .
                Just Click the Button below to validate your email address.
                </p>
        <a href= ${url} style="background : crimson ; text-decoration:none; color :white; padding:10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>
        <br><p>
        If the button doesn't work for any reason, you can also click on the link below : 
        </p><br>
        <div> ${url}</div>
        </div>
        
        
        `
    }

    smtpTransport.sendMail(mailOptions, (err, infor)=>{
      
        if (err) return err ;
        return infor
    })

       



}

module.exports = sendEmail;