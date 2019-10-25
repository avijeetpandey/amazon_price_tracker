const nightmare=require('nightmare')();
require('dotenv').config();
const sMail=require('@sendgrid/mail');
sMail.setApiKey(process.env.SEND_API_KEY)

const args=process.argv.slice(2);
const url=args[0];
const minprice=args[1];



//const url='https://www.amazon.in/dp/B07V1KDNRR';

checkPice();

async function checkPice() {

    try {
        let price=await nightmare.goto(url)
        .wait("#priceblock_ourprice")
       .evaluate(()=>{
         return   document.getElementById("priceblock_ourprice").innerText;
           })
       .end()

       
      price=price.slice(1);

      let numberPrice=parseFloat(price.replace(',',''));

      if(numberPrice < minprice) {
          sendMail("Time to buy",
          `The price of ${url} is below ${minprice} , go for it `
          )
      }
       
        
    } catch (error) {
        sendMail("There is an error on the price checker ",error.message)
        throw error;
    }

}




 function sendMail(subject,body){
    const email={
        to:"ENTER_YOUR_MAIL_ADDRESS_HERE",
        from:"amazonpriceChecker@example.com",
        subject:subject,
        text : body,
        html : body
    }

    return sMail.send(email);
}