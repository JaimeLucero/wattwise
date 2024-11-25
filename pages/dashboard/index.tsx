import React from 'react';
import Header from '@components/header/Header'

const Dashboard = () => {
  return (
    <main
    style={{
        backgroundColor: '#FFFBDE',  // Set your desired background color here
        height: '100%',  // Full viewport height
        padding: 0,
        margin: 0,
        display: 'flex',  // Flexbox container
        flexDirection: 'column',
        textAlign: 'center',      // Center align text inside the container
      }}
    >
        <div
        style={{
            width: '100%',
            boxShadow: '4px 8px 16px rgba(0, 0, 0, 0.2)', // A stronger shadow effect
        }}>
            <Header/>
        </div>
        <h1
        style={{
            fontSize: '3rem',
            fontWeight: 'normal',
            whiteSpace: 'nowrap',
            fontFamily: 'Istok Web',
            textAlign: 'left',
            paddingLeft: '20px'
          }}
        >
            Dashboard
        </h1>
        <div
        style={{
            display: 'flex',
            alignItems: 'center'
        }}
        >
            <h1
            style={{
                fontSize: '1rem',
                fontWeight: 'normal',
                whiteSpace: 'nowrap',
                fontFamily: 'Istok Web',
                textAlign: 'left',
                paddingLeft: '20px',
                paddingRight: '20px'
              }}
            >
                Name:
            </h1>
            <input
                type="text"
                placeholder="Enter text"
                style={{
                    padding: '8px',               // Padding inside the input box
                    border: '2px solid #000',      // Border with a solid color (black)
                    borderRadius: '50px',          // Rounded corners with 10px radius
                    outline: 'none',               // Remove default outline on focus
                    fontSize: '16px',              // Font size
                    backgroundColor: 'transparent',    // Make the background transparent
                    width: '20vw'
                }}
                />
            <h1
            style={{
                fontSize: '1rem',
                fontWeight: 'normal',
                whiteSpace: 'nowrap',
                fontFamily: 'Istok Web',
                textAlign: 'left',
                paddingLeft: '20px',
                paddingRight: '20px'
              }}
              >
                Account Number:
            </h1>
            <input
                type="text"
                placeholder="Enter text"
                style={{
                    padding: '8px',               // Padding inside the input box
                    border: '2px solid #000',      // Border with a solid color (black)
                    borderRadius: '50px',          // Rounded corners with 10px radius
                    outline: 'none',               // Remove default outline on focus
                    fontSize: '16px',              // Font size
                    backgroundColor: 'transparent',    // Make the background transparent
                    width: '20vw'
                }}
                />
        </div>
        <div
        style={{
            display: 'flex',
            alignItems: 'center',
            alignSelf: 'center',
            paddingTop: '30px',
            height: '40vh',
            width: '1000px',
            justifyContent: 'space-between'
        }}
        >
            <div
            style={{
                background: '#B2EFFF',
                width: '40vh',
                height: '100%',
                borderRadius: '40px'
            }}  
            >
                <h1
                style={{
                    margin: '10px',
                    fontSize: '2rem'
                }}
                >
                    Consumption Cost
                </h1>

                <h1
                style={{
                    margin: '10px',
                    fontSize: '3rem'
                }}
                >
                    $ 100,000
                </h1>
                <h2
                style={{
                    fontSize: '1rem'
                }}
                >
                    Calculated total cost
                </h2>
                <div
                style={{
                    width: '100%',
                    height: '100%',
                    textAlign: 'left',
                    margin: '30px'
                }}
                >
                    <h2
                    style={{
                        fontSize: '1rem'
                    }}
                    >
                        Active Power
                    </h2>
                    <h2
                    style={{
                        fontSize: '1rem'
                    }}
                    >
                        Reactive Power
                    </h2>
                    <h2
                    style={{
                        fontSize: '1rem'
                    }}
                    >
                        Voltage
                    </h2>
                    <h2
                    style={{
                        fontSize: '1rem'
                    }}
                    >
                        Intensity
                    </h2>
                </div>
            </div>

            <div
            style={{
                background: '#FCF4B6',
                width: '40vh',
                height: '100%',
                borderRadius: '40px'
            }}  
            >
                <h1
                style={{
                    margin: '10px',
                    fontSize: '2rem'
                }}
                >
                    Total Consumption
                </h1>

            </div>
        </div>
        <div
        style={{
            margin: '20px',
            width: '1000px',
            height: '100%'
        }}
        >
            

        </div>
    </main>
  );
};

export default Dashboard;
