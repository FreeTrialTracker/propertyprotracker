import mailchimp from '@mailchimp/mailchimp_marketing';

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

export default async function handler(req, res) {
  const { email } = req.body;

  if (!email || !email.length) {
    return res.status(400).json({
      error: 'Please provide an email address',
    });
  }

  try {
    await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
      email_address: email,
      status: 'subscribed',
    });

    return res.status(201).json({ error: null });
  } catch (error) {
    return res.status(400).json({
      error: `There was an error subscribing to the newsletter. Hit me up at ogbonnakell@gmail and I'll add you to the list.`,
    });
  }
}