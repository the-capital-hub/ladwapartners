const smsCountryUrl = process.env.SMS_COUNTRY_API_URL;
const smsAuthKey = process.env.SMS_COUNTRY_AUTH_KEY;
const smsSenderId = process.env.SMS_COUNTRY_SENDERID;
const smsToken = process.env.SMS_COUNTRY_AUTH_TOKEN;

const SMS_TEMPLATE =
  "Your Ladwa Solutions verification OTP is *. It's valid for * minutes, https://ladwas.com/. Do not share this code. - LADWA";
const authHeader = `Basic ${Buffer.from(`${smsAuthKey}:${smsToken}`).toString(
  "base64"
)}`;

export const sendOtpMobile = async (mobile, code) => {
  const mobileNO = `91${mobile}`;
  const validity = 10;
  const message = SMS_TEMPLATE.replace("*", code).replace("*", validity);

  try {
    const response = await fetch(`${smsCountryUrl}/${smsAuthKey}/SMSes/`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Text: message,
        Number: mobileNO,
        SenderId: smsSenderId,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        `Failed with status ${response.status}: ${
          data?.Message || "Unknown error"
        }`
      );
    }

    return true;
  } catch (error) {
    throw new Error(`Failed to send OTP to mobile: ${error.message}`);
  }
};
