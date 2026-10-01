import Seo from "../components/Seo";

export default function TermsOfService() {
  return (
    <>
      <Seo title="Terms of Service" description="The terms and conditions for using thirdbiome.com, including acceptable use, intellectual property, and governing law." />
      <section className="sheet v5-page" data-screen-label="Terms hero">
        <div className="wrap">
          <span className="eyebrow">Legal · Terms</span>
          <h1>Terms and Conditions</h1>
          <p>Last Updated: July 19, 2025</p>
        </div>
      </section>

      <section className="sheet sheet--pad" data-screen-label="Terms body">
        <div className="wrap">
          <div className="v5-legal" style={{ maxWidth: 760, marginInline: "auto" }}>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using the website located at{" "}
              <a href="https://www.thirdbiome.com">www.thirdbiome.com</a> ("Website"),
              you agree to be bound by these Terms and Conditions ("Terms"). If you do
              not agree to these Terms, please do not use our Website.
            </p>

            <h2>2. Use of the Website</h2>
            <p>
              You agree to use the Website only for lawful purposes and in a way that
              does not infringe the rights of, restrict or inhibit anyone else's use and
              enjoyment of the Website. Prohibited behavior includes harassing or causing
              distress or inconvenience to any person, transmitting obscene or offensive
              content or disrupting the normal flow of dialogue within our Website.
            </p>

            <h2>3. Intellectual Property</h2>
            <p>
              All content on this Website, including text, graphics, logos, images, and
              software, is the property of Aeobiome Healthcare Pvt. Ltd. and is protected
              by international copyright laws.
            </p>

            <h2>4. Limitation of Liability</h2>
            <p>
              Aeobiome Healthcare Pvt. Ltd. will not be liable for any damages that will
              arise from the use of this Website. This includes, but is not limited to,
              direct, indirect, incidental, punitive, and consequential damages.
            </p>

            <h2>5. Governing Law</h2>
            <p>
              These Terms and Conditions are governed by and construed in accordance with
              the laws of India. Any disputes relating to these terms and conditions will
              be subject to the exclusive jurisdiction of the courts of Coimbatore, Tamil
              Nadu.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about these Terms and Conditions, please contact
              us at:
            </p>
            <p>
              <strong>Aeobiome Healthcare Pvt. Ltd.</strong>
              <br />
              Email: <a href="mailto:support@thirdbiome.com">support@thirdbiome.com</a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
