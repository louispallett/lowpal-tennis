export default function UsingData() {
    return (
        <div className="flex flex-col gap-3.5 dark:text-slate-100">
            <h4 className="text-center">Data and Privacy Policy</h4>
            <div>
                <h5>1. Introduction</h5>
                <p>We value your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website or use our application and tell you about your privacy rights and how the law protects you.</p>
            </div>
            <div>
                <h5>2. Data We Collect</h5>
                <p>All data is stored securely via <a href="https://www.mongodb.com/" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-all">MongoDB Atlas</a>. Aside from this, your data is never shared with any third parties or stored unsecurely. When logged in, your data is passed
                 from and to client via a <a href="https://www.npmjs.com/package/jsonwebtoken" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-all">Json Web Token</a> (JWT) Passwords are hashed in accordance with 
                 the <a href="https://datatracker.ietf.org/doc/html/rfc8018#section-4" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-all">Internet Engineering Task Force (IETF) Password-Based Cryptopgraphy Specification</a>, specifically chapter 4, section 2, which highlights the iteration count
                 being a minimum of 1,000.
                </p>
                <p className="my-1.5">We, therefore, collect the following:</p>
                <ul className="list-disc">
                    <li>Personal Identification Information: Name, email address, password (hashed).</li>
                    <li>Contact information: Mobile (for the use of contact from other teams/players)</li>
                    <li>Tournament Preferences: The tournaments you sign up for.</li>
                    <li>Match Data: Scores and schedule of matches.</li>
                </ul>
            </div>
            <div>
                <h5>3. How We Use Your Data</h5>
                <ul className="list-disc">
                    <li>To register you for tournaments.</li>
                    <li>To manage match schedules and track scores.</li>
                    <li>To communicate with you regarding your participation in tournaments.</li>
                    <li>To share contact details among players who play with/against.</li>
                </ul>
            </div>
            <div>
                <h5>4. Data Security</h5>
                <p>We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way.</p>
                <p>Security of stored data is also handled by MongoDB Inc.</p>
            </div>
            <div>
                <h5>5. Deletion of Data</h5>
                <p>All data will be deleted within 4 weeks of the end of the tournament.</p>
            </div>
            <div>
                <h5>6. Your Legal Rights</h5>
                <p>You have the right to request access to, correction of, or deletion of your personal data. You also have the right to withdraw consent at any time.</p>
            </div>
            <div>
                <h5>7. Contact Us</h5>
                <p>If you have any questions about this privacy policy or our data protection practices, please contact us.</p>
            </div>
        </div>
    )
}