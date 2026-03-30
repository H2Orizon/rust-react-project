export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                
                <div>
                    <h4>Booking App</h4>
                    <p>Resource booking system</p>
                </div>

                <div>
                    <h4>Navigation</h4>
                    <p>Resources</p>
                    <p>Categories</p>
                </div>

                <div>
                    <h4>Contacts</h4>
                    <p>Email: info@booking.com</p>
                </div>

            </div>

            <div className="footer-bottom">
                © {new Date().getFullYear()} Booking App
            </div>
        </footer>
    );
}