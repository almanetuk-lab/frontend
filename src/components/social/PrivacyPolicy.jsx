// PrivacyPolicyFull.jsx
import React, { useState } from 'react';
import { 
  FaChevronDown, 
  FaChevronUp, 
  FaShieldAlt, 
  FaCookie, 
  FaUserCheck, 
  FaGlobeAmericas,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaDatabase,
  FaUserShield,
//   FaDownload,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

const PrivacyPolicy = () => {
  const [expandedSections, setExpandedSections] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [visibleSections, setVisibleSections] = useState(2);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleViewMore = () => {
    if (showAll) {
      setVisibleSections(2);
      setShowAll(false);
    } else {
      setVisibleSections(sections.length);
      setShowAll(true);
    }
  };

  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      icon: <FaShieldAlt className="text-blue-600" />,
      content: `Spark Networks Services GmbH cares about your personal data, which is why we have drafted this Privacy Policy for you. This Privacy Policy is meant to help you understand what data we collect, why we collect it, what we do with it and how we safeguard it. We encourage you to read this Privacy Policy carefully when using our websites or services or transacting business with us.
      
All personal data collected from you will be processed in accordance with this Privacy Policy. If you have any further questions please contact us, our contact information can be found at the bottom of this Privacy Policy.

EliteSingles is an internet-based service which brings people together who are looking for a long-lasting relationship. To successfully provide this service, we collect and use your personal information.

Please note that this Privacy Policy applies to all our services, including the Website and the Apps (together, the "Services"). When using our Services, you may find links to other websites, apps and services, or tools that enable you to share information with other websites, apps and services. We are not responsible for the privacy practices of these other websites, apps and services and we recommend that you review the privacy policies of each of these websites, apps or services before sharing any personal data.

If you do not agree to any of the provisions of this Privacy Policy, you should not use our Services.`
    },
    {
      id: 'personal-info',
      title: 'Your Personal Information',
      icon: <FaUserCheck className="text-green-600" />,
      content: `All the personal information we collect is related to providing and improving our Services and its features and falls into three general categories:
• Information you provide to us
• Information collected automatically
• Information we obtain from third parties

In many cases, personal information is only used in pseudonym form or anonymously.

What Personal Information we collect:

1. Without Registration
When you visit our websites, we store the following data by default:
• IP address (Internet Protocol address) of the accessing computer
• The website from which you visit us (referrer)
• The sites that you visit from our website
• The date and time of your visit
• The type of browser settings
• Operating System

This data is used by us for statistical purposes without reference to individuals.

2. With Registration
We only use the personal information that you actively provide us (e.g. contact information for registration, profile information or photos). In many cases, you can decide what personal information you reveal about yourself in your profile and / or in your search activity.

We provide Free Memberships and Paid Memberships.

Free Membership
With the Free Membership you will be prompted to provide the following details, without which registration cannot be completed:
• Gender
• Gender of the partner you are seeking
• E-mail address
• Password

Our personality test follows your registration. First, we ask for the following information to identify suitable partners:
• Postal code
• Date of birth
• Height
• Marital Status
• Education
• Occupation
• Income

During the personality test, you will be asked to answer a series of personal questions (e.g. partner preferences, personal characteristics and desired traits in a partner).`

    },
    {
      id: 'cookies',
      title: 'Cookies & Tracking Technologies',
      icon: <FaCookie className="text-yellow-600" />,
      content: `We use "cookies" to make your interaction with the platforms individually identifiable and optimized. A cookie is a text file that is either stored temporarily in the computer's memory ("session cookies") or saved on the hard drive ("permanent cookie"). 

Types of Cookies We Use:

Session Cookies: we mostly use "session cookies", which are not stored on your hard drive and are deleted when the browser is closed. Session cookies are used for login authentication and to balance the system load.

Partner and Affiliate Cookies:** we use these cookies if you access our Services via an external advertising space. These cookies are used to settle accounts with our cooperation partners and do not contain personal information from you.

Permanent cookies: we use "permanent cookies" to save your personal use settings. This allows for personalization and improves the we service, because you can find your personal settings again on subsequent visits.

Cookie Categories:

Strictly Necessary Cookies
These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in or filling in forms.

Performance Cookies
These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.

Functional Cookies
These cookies enable the website to provide enhanced functionality and personalisation. They may be set by us or by third party providers whose services we have added to our pages.

Targeting Cookies
These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.`
    },
    {
      id: 'data-processing',
      title: 'Data Processing Tools',
      icon: <FaDatabase className="text-purple-600" />,
      content: `Tools used to Process Data:

(a) Use of Analysis Programs and Remarketing
Intentional Connections analyses members' online behavior. We create anonymous user profiles to improve our service to you. For this we use Google Analytics (with, among other things, the feature Universal Analytics).

(b) Use of Google DoubleClick
Intentional Connections uses the remarketing technology of Google (Google DoubleClick). Through this technology, users who have already visited the Intentional Connections site and have shown interest in the service are again targeted with advertising on the pages owned by the Google partner network.

(c) Facebook Plugins
We use social plugins ("plugins") provided by the social network Facebook.com.

(d) Use Google+ Social Plugins
We use the "+1" the social network Google Plus.

() Use of Twitter Social Plugins
We use social plugins ("plugins") from the social network Twitter.com.

(f) Outbrain
Outbrain is a premium discovery platform that helps connect marketers to their target audience through personalized recommendations.

(g) Piwik
This website uses Piwik, a web analytics open-source software.

(h) Ve Interactive
We use the services of Ve Interactive DACH GmbH.

(i) Zendesk
We use the chat program Zendesk Chat, a service of Zendesk, Inc.

(j) Use of payment processors
Stripe and Adyen process payment data for our paid memberships.`
    },
    {
      id: 'data-storage',
      title: 'Data Storage & Security',
      icon: <FaLock className="text-red-600" />,
      content: `**Storing and retention period**
We will only store your personal data for as long as is necessary to fulfill our contractual and legal obligations, or for longer periods only where permitted by applicable law.

When you close your account, we will delete all information we hold about you. If a complete deletion of your data is not possible or not necessary for legal reasons, the data concerned will be blocked for further processing.

Tools used to safeguard your Data
We use technological, organizational, and physical protection measures designed to protect against unauthorized use, disclosure or access of the personal information we collect. All information you submit to us at registration or login is encrypted.

The encryption technique we use is SSL (Secure Socket Layer). It is an accepted and widely used technology. In view of our personal information collection, technical precautions have been taken to store your personal information in a secure environment.

Access to your information is limited to only a few selected employees and service providers and will be granted only for carrying out the purposes identified in this policy, quality control and review of complaints, and for thwarting fraud.

Personal information we collect is stored in the EU.`
    },
    {
      id: 'user-rights',
      title: 'User Rights Under GDPR',
      icon: <FaUserShield className="text-indigo-600" />,
      content: `According to the GDPR you have the following rights in relation to your information, which you may exercise at any time in written form.

• The right to be informed
The right to be informed encompasses the data controller's obligation to provide 'fair processing information', typically through a privacy notice.

• The right of access
The right of access gives the data subject the right to request information regarding his/her personal data from the data controller.

• The right to rectification
It gives data subjects the right to require the controller to rectify inaccuracies about their personal data.

• The right to erasure/right to be forgotten
The right to erasure allows the data subject to require the controller to remove or delete their personal data from their system.

• The right to restrict processing
The right to restriction of processing allows data subjects to demand from controllers to stop processing their personal data.

• The right to data portability
The right to data portability gives the data subject the right to require the controller to provide information in a structured, commonly used and machine-readable form.

• The right to object
The right to object allows data subjects to prevent controllers from further processing of their personal data if there are no legitimate grounds for the processing of the data.

• The right to withdraw consent at any time
You have the right to withdraw your consent at any time. Withdrawing consent will be made easy by us.

• The right to lodge a complaint with a supervisory authority
If we do not respond to your request within a month, you have the right to lodge a complaint at the supervisory authority, and seek a judicial remedy.`
    },
    {
      id: 'contact',
      title: 'Contact Information',
      icon: <FaEnvelope className="text-pink-600" />,
      content: `United Kingdom Contact:
123 Dating Street
Suite 100
Uk

Email: https:support.intentionalconnections.app

**United States Contact:**
EliteSingles Customer Care –
Spark Networks Services GmbH
Attn: Legal
3400 N. Ashton Blvd, Suite 175
Lehi, UT 84043
United Kindum

Email: https:support.intentionalconnections.app

Data Protection Officer:
EliteSingles has its own Data Protection Officer, who is responsible for all matters related to privacy and data protection. This Data Protection Officer can be reached at dataprotection@elitesingles.co.uk

 Updated:
Berlin, May 2026`
    }
  ];

  const displaySections = showAll ? sections : sections.slice(0, visibleSections);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-gray-200">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Intentional Connections Privacy Policy
            </h1>
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
              <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                <FaShieldAlt />
                <span className="font-semibold">GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                <FaLock />
                <span className="font-semibold">SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full">
                <FaGlobeAmericas />
                <span className="font-semibold">Global Coverage</span>
              </div>
            </div>
            <p className="text-gray-600 text-lg">
              This Privacy Policy explains how Intentional Connections collects, uses, and protects your personal information.
            </p>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaMapMarkerAlt className="text-blue-600 text-xl" />
              </div>
              <h3 className="font-bold text-gray-800">UK Headquarters</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Spark Networks Services GmbH<br />
              c/o Mindspace, Zimmerstraße 78<br />
              10117 Berlin, Germany
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <FaEnvelope className="text-green-600 text-xl" />
              </div>
              <h3 className="font-bold text-gray-800">Contact Email</h3>
            </div>
            <p className="text-gray-600 text-sm">
              UK: https:www.intentionalconnections.app/privacy<br />
              US: cancellation@intentionalconnections.app
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-red-100 p-3 rounded-lg">
                <FaPhone className="text-red-600 text-xl" />
              </div>
              <h3 className="font-bold text-gray-800">Support</h3>
            </div>
            <p className="text-gray-600 text-sm">
              24/7 Customer Support<br />
              Data Protection Officer Available<br />
              Quick Response Guaranteed
            </p>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-4">
          {displaySections.map((section) => (
            <div key={section.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    {section.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{section.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {expandedSections[section.id] ? 'Click to collapse' : 'Click to expand'}
                    </p>
                  </div>
                </div>
                {expandedSections[section.id] ? (
                  <FaChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <FaChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {expandedSections[section.id] && (
                <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                  <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {section.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* View More/Less Button */}
        {sections.length > 2 && (
          <div className="mt-8 text-center">
            <button
              onClick={handleViewMore}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
            >
              {showAll ? (
                <>
                  <FaEyeSlash />
                  Show Less
                </>
              ) : (
                <>
                  <FaEye />
                  View More Sections
                </>
              )}
            </button>
            <p className="text-gray-500 text-sm mt-2">
              {showAll 
                ? `Showing all ${sections.length} sections` 
                : `Showing ${visibleSections} of ${sections.length} sections`
              }
            </p>
          </div>
        )}

        {/* Important Notice */}
        <div className="mt-10 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="bg-yellow-100 p-2 rounded-lg mt-1">
              <FaShieldAlt className="text-yellow-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">Important Notice</h3>
              <p className="text-gray-700">
                This Privacy Policy is periodically reviewed and updated. Please check back regularly for any changes. 
                If you have any questions about how we handle your data, please contact our Data Protection Officer.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  Last Updated: May 2026
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Version: 2026.1
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  Effective Immediately
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Download Option */}
        {/* <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Need a Copy?</h3>
              <p className="text-gray-600">Download this Privacy Policy for your records</p>
            </div>
            <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              <FaDownload />
              Download PDF
            </button>
          </div>
        </div> */}

    
      </div>
    </div>
  );
};

export default PrivacyPolicy;