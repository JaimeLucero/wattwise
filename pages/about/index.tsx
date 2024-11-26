import React from 'react';
import Header from '@components/header/Header';

const About: React.FC = () => {
  return (
    <main
    style={{
        backgroundColor: '#FFFBDE',  // Set your desired background color here
        height: '100vh',  // Full viewport height
        display: 'flex',  // Flexbox container
        flexDirection: 'column',
        textAlign: 'center',      // Center align text inside the container
      }}
    >
        <Header/>
        <div
        style={{
            display:'flex',
            flexDirection: 'column',
            padding: '20px'
        }}
        >
            <h1
            style={{
                fontSize: '2rem',
                textAlign: 'left',
                paddingLeft: '50px'
            }}
            >
                What is this Dashboard all about?
            </h1>
            <div
            style={{
                paddingTop: '50px',
                display: 'flex',
                flexDirection: 'column',
                paddingLeft: '80px',
                textAlign: 'left',
                fontSize: '2rem',
                gap: '10px'
            }}
            >
                <p>Welcome to the Electricity Consumption Dashboard – your comprehensive tool for monitoring and analyzing household power usage. This interactive platform provides insightful visualizations of key metrics like active power, reactive power, voltage, and current intensity.</p>
                <p>With features like data filters, drill-down capabilities, and real-time insights, the dashboard empowers users to track energy trends, identify peak consumption periods, and optimize electricity usage effectively.</p>
                <p>Designed to simplify energy management, it also offers actionable tips to help households save on their monthly bills while promoting sustainable consumption practices.</p>
            </div>
            <h1
            style={{
                fontSize: '2rem',
                textAlign: 'left',
                paddingTop: '30px',
                paddingLeft: '50px'
            }}
            >
               Developers
            </h1>
            <div
            style={{
                display: 'flex',
                justifyItems: 'space-between',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%'
            }}
            >
                <div
                style={{
                    display: 'flex',
                    justifyItems: 'space-between',
                    alignItems: 'center',
                }}
                >
                    <img src="jaime.svg" alt="Logo" width="200" height="200" style={{ paddingLeft: '20px' }} />
                    <div
                    style={{
                        display:'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        alignItems: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 'regular'
                    }}
                    >
                        <h3>Jaime Emanuel B. Lucero</h3>
                        <h3>BS in Computer Science</h3>
                        <h3>University of Southeastern Philippines</h3>
                        <h3>Email: jeblucero00111@usep.edu.ph</h3>
                    </div>
                </div>
                <div
                style={{
                    display: 'flex',
                    justifyItems: 'space-between',
                    alignItems: 'center',
                }}
                >
                    <img src="lindsay.svg" alt="Logo" width="200" height="200" style={{ paddingLeft: '20px' }} />
                    <div
                    style={{
                        display:'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        alignItems: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 'regular'
                    }}
                    >
                        <h3>Lindsay B. Cañete</h3>
                        <h3>BS in Computer Science</h3>
                        <h3>University of Southeastern Philippines</h3>
                        <h3>Email: lbcanete00090@usep.edu.ph</h3>
                    </div>
                </div>
            </div>
        </div>

    </main>
  );
};

export default About;
