(function () {
  emailjs.init("BLHgITiuzgDuBRXbK");
})();

export default function sendEmail(formObject) {
  console.log(formObject, "sending email");
  const sendData = {
    name: formObject.name,
    email: formObject.email,
    message: formObject.project_details,
  };
  emailjs.send("service_0zvd1ge", "template_qpic6go", sendData).then(
    (response) => {
      console.log(response);
      alert(
        `Thank you ${formObject.name} for reaching out.I look forward to working with you`
      );
    },
    (error) => {
      console.log(error);
      alert("Opps! Something went wrong. Please try again");
    }
  );
}
