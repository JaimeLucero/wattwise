import React from 'react';
import Header from '@components/header/Header';

const About: React.FC = () => {
  return (
    <main
      style={{
        backgroundColor: '#FFFBDE',
        minHeight: '100vh', // Ensure it spans the full viewport height
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
      }}
    >
      <Header />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          paddingTop: '70px'
        }}
      >
        {/* Title Section */}
        <h1
          style={{
            fontSize: '2rem',
            textAlign: 'left',
            padding: '20px',
          }}
        >
          What is this Dashboard all about?
        </h1>

        {/* Content Section */}
        <div
          style={{
            paddingTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            fontSize: '1.2rem', // Adjust font size for responsiveness
            lineHeight: '1.6', // Improve readability
            gap: '20px',
            textAlign: 'left',
          }}
        >
          <p>
            Welcome to the Electricity Consumption Dashboard – your comprehensive tool for monitoring and analyzing household power usage. This interactive platform provides insightful visualizations of key metrics like active power, reactive power, voltage, and current intensity.
          </p>
          <p>
            With features like data filters, drill-down capabilities, and real-time insights, the dashboard empowers users to track energy trends, identify peak consumption periods, and optimize electricity usage effectively.
          </p>
          <p>
            Designed to simplify energy management, it also offers actionable tips to help households save on their monthly bills while promoting sustainable consumption practices.
          </p>
        </div>

        {/* Developers Section */}
        <h1
          style={{
            fontSize: '2rem',
            textAlign: 'left',
            padding: '20px',
          }}
        >
          Developers
        </h1>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap', // Allow wrapping for smaller screens
            justifyContent: 'space-around',
            alignItems: 'center',
            gap: '30px',
            padding: '20px',
          }}
        >
          {/* Developer 1 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '300px',
              textAlign: 'center',
            }}
          >
            <img
              src="jaime.svg"
              alt="Jaime's Logo"
              style={{
                width: '150px',
                height: '150px',
                objectFit: 'cover', // Ensure image scales properly
                borderRadius: '50%', // Optional: Make it circular
                marginBottom: '15px',
              }}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                fontSize: '1rem',
              }}
            >
              <h3>Jaime Emanuel B. Lucero</h3>
              <h4>BS in Computer Science</h4>
              <p>University of Southeastern Philippines</p>
              <p>Email: jeblucero00111@usep.edu.ph</p>
            </div>
          </div>

          {/* Developer 2 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '300px',
              textAlign: 'center',
            }}
          >
            <img
              src="lindsay.svg"
              alt="Lindsay's Logo"
              style={{
                width: '150px',
                height: '150px',
                objectFit: 'cover',
                borderRadius: '50%', // Optional: Make it circular
                marginBottom: '15px',
              }}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                fontSize: '1rem',
              }}
            >
              <h3>Lindsay B. Cañete</h3>
              <h4>BS in Computer Science</h4>
              <p>University of Southeastern Philippines</p>
              <p>Email: lbcanete00090@usep.edu.ph</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default About;
