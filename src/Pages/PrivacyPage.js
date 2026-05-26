import React from 'react';
import Layout from '../Components/Layout/Layout';
import './PrivacyPage.css';

function PrivacyPage() {
  return (
    <Layout>
      <div className="cs-page cs-container privacy-page">
        <h1>Privacy Policy</h1>
        <p className="privacy-page__updated">Last updated: {new Date().toLocaleDateString()}</p>

        <section>
          <h2>What we collect</h2>
          <p>
            CARONSELL stores account information for dealers (email, dealership name, city,
            WhatsApp number) and car listing details you submit. Buyers browse without creating
            an account.
          </p>
        </section>

        <section>
          <h2>How we use data</h2>
          <p>
            Listing data is displayed publicly so buyers can find cars. WhatsApp contact opens
            in your WhatsApp app; we do not process payments or messages inside CARONSELL.
          </p>
        </section>

        <section>
          <h2>Third parties</h2>
          <p>
            We use Google Firebase for authentication, database, and image storage. WhatsApp
            is operated by Meta when you use the contact button.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>For privacy questions, contact your dealership administrator or app operator.</p>
        </section>
      </div>
    </Layout>
  );
}

export default PrivacyPage;
