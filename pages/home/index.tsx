import { NextPage } from 'next';
import Header from '@components/header/Header';
import Image from 'next/image';

const Home: NextPage = () => {
  return (
    <main
      style={{
        backgroundColor: '#FFFBDE',  // Set your desired background color here
        height: '100%',  // Full viewport height
        padding: 0,
        margin: 0,
        display: 'flex',  // Flexbox container
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',      // Center align text inside the container
      }}
    >
        <Header />

        <div>
          <div style={{ position: 'relative', width: '100%' }}>
          {/* The Image will be the background */}
          <div style={{ position: 'relative', width: '100%', height: '400px' }}>
            <Image
              src="/bg.png"
              alt="Description of image"
              layout="fill"              // Makes the image cover the full container
              objectFit="cover"         // Ensures the image covers the area
            />
          </div>

          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',           // Center text horizontally
              color: 'white',                // Text color for the header
              alignItems: 'center',            // Vertically center content
              justifyContent: 'center',        // Center the button text horizontally
            }}
          >
            <h1
              style={{
                fontSize: '3rem',
                fontWeight: 'normal',
                whiteSpace: 'nowrap',
                fontFamily: 'Istok Web',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' // Optional for better text visibility
              }}
            >
              WattWise: Power Consumption Monitoring
            </h1>

            <button
              style={{
                position: 'absolute',
                left: '40%',
                backgroundColor: 'rgba(253, 255, 252, 0.4)',      // Set button color
                color: 'black',                  // Text color
                fontSize: '16px',                // Font size
                fontWeight: 'regular',              // Bold text
                padding: '10px 20px',            // Padding inside the button
                borderRadius: '25px',            // Rounded corners
                display: 'flex',                 // Flexbox to align the arrow
                cursor: 'pointer',              // Pointer cursor on hover
                marginTop: '20px',               // Add space between the text and button
              }}
            >
              <span>Know More</span>
              {/* Right Arrow Icon */}
              <span
                style={{
                  marginLeft: '10px',            // Space between text and arrow
                  fontSize: '20px',              // Arrow size
                }}
              >
                ➡
              </span>
            </button>
          </div>
        </div>

        <h1
        style={{
          padding: 20,
          position: 'relative',
          color: 'black',           // Set text color to make it visible
          fontSize: '2rem',
          fontWeight: 'normal',  
          fontFamily: 'Istok Web',
        }}
        >
          EXPLORE WATT
        </h1>
        
        <div
          style={{
            display: 'flex',             // Enable Flexbox layout
            justifyContent: 'center',    // Horizontally center the content
            alignItems: 'center',        // Vertically center the content
            width: '80%',
            height: 'auto',              // Allow height to grow with content
            margin: '0 auto',            // Center the container horizontally
          }}
        >
          <h2
          style={{
            fontSize: 20,
            fontWeight: 'normal',
            position: 'relative',
            textAlign: 'center', // Center the text inside the h2
          }}
          >
          WattWise provides detailed insights into household power consumption trends over time, helping both electrical companies and consumers identify patterns in energy usage. By tracking and analyzing these trends, WattWise serves as a valuable tool to understand, manage, and measure energy use for each household effectively.
          </h2>
        </div>
      </div>
      <div
        style={{
          display: 'flex',               // Enable Flexbox
          flexDirection: 'column',       // Stack items vertically (column layout)
          alignItems: 'center',          // Center items horizontally
          position: 'relative',            // Make the parent relative to position child absolutely
        }}
      >
          <img src="circles.svg" alt="circles"
           style={{ 
            paddingTop: '30px',
            width: '100vw',
          }}/>

          <div
          style={{
            position: 'absolute',         // Position it on top of the image
            top: '60%',
            left: '50%',
            display: 'flex',
            transform: 'translate(-50%, -50%)', // Adjust positioning to truly center the div
            flexDirection: 'column',
            alignItems: 'center',    // Center align the items horizontally
            justifyContent: 'center', // Vertically center the items
            gap: '20px', 
          }}
          >
            <h1
            style={{
              position: 'relative',
              color: 'black',           // Set text color to make it visible
              fontSize: '2rem',
              fontWeight: 'normal',  
              fontFamily: 'Istok Web',
            }}>
              Overview
            </h1>
            <button
              style={{
                backgroundColor: 'rgba(253, 255, 252)',    // Set button color
                color: 'black',                                  // Text color
                fontSize: '16px',                                // Font size
                fontWeight: 'regular',                           // Regular text weight
                padding: '10px 20px',                            // Padding inside the button
                borderRadius: '25px',                            // Rounded corners
                display: 'flex',                                 // Flexbox to align the text and arrow
                justifyContent: 'center',                        // Center the text horizontally
                alignItems: 'center',                            // Center the text vertically
                cursor: 'pointer',                              // Pointer cursor on hover
                marginTop: '20px',                               // Space between the text and button
                textAlign: 'center',                             // Ensure the text is centered
                width: '250px'                                   // Set fixed width for the button
              }}
            >
              <span>Global Active Power</span>
              {/* Right Arrow Icon */}
              <span
                style={{
                  marginLeft: '10px',            // Space between text and arrow
                  fontSize: '20px',              // Arrow size
                }}
              >
                ➡
              </span>
            </button>
            <button
              style={{
                backgroundColor: 'rgba(253, 255, 252)',    // Set button color
                color: 'black',                                  // Text color
                fontSize: '16px',                                // Font size
                fontWeight: 'regular',                           // Regular text weight
                padding: '10px 20px',                            // Padding inside the button
                borderRadius: '25px',                            // Rounded corners
                display: 'flex',                                 // Flexbox to align the text and arrow
                justifyContent: 'center',                        // Center the text horizontally
                alignItems: 'center',                            // Center the text vertically
                cursor: 'pointer',                              // Pointer cursor on hover
                marginTop: '20px',                               // Space between the text and button
                textAlign: 'center',                             // Ensure the text is centered
                width: '250px'                                   // Set fixed width for the button
              }}
            >
              <span>Global Reactive Power</span>
              {/* Right Arrow Icon */}
              <span
                style={{
                  marginLeft: '10px',            // Space between text and arrow
                  fontSize: '20px',              // Arrow size
                }}
              >
                ➡
              </span>
            </button>
            <button
              style={{
                backgroundColor: 'rgba(253, 255, 252)',    // Set button color
                color: 'black',                                  // Text color
                fontSize: '16px',                                // Font size
                fontWeight: 'regular',                           // Regular text weight
                padding: '10px 20px',                            // Padding inside the button
                borderRadius: '25px',                            // Rounded corners
                display: 'flex',                                 // Flexbox to align the text and arrow
                justifyContent: 'center',                        // Center the text horizontally
                alignItems: 'center',                            // Center the text vertically
                cursor: 'pointer',                              // Pointer cursor on hover
                marginTop: '20px',                               // Space between the text and button
                textAlign: 'center',                             // Ensure the text is centered
                width: '250px'                                   // Set fixed width for the button
              }}
            >
              <span>Voltage</span>
              {/* Right Arrow Icon */}
              <span
                style={{
                  marginLeft: '10px',            // Space between text and arrow
                  fontSize: '20px',              // Arrow size
                }}
              >
                ➡
              </span>
            </button>
            <button
              style={{
                backgroundColor: 'rgba(253, 255, 252)',    // Set button color
                color: 'black',                                  // Text color
                fontSize: '16px',                                // Font size
                fontWeight: 'regular',                           // Regular text weight
                padding: '10px 20px',                            // Padding inside the button
                borderRadius: '25px',                            // Rounded corners
                display: 'flex',                                 // Flexbox to align the text and arrow
                justifyContent: 'center',                        // Center the text horizontally
                alignItems: 'center',                            // Center the text vertically
                cursor: 'pointer',                              // Pointer cursor on hover
                marginTop: '20px',                               // Space between the text and button
                textAlign: 'center',                             // Ensure the text is centered
                width: '250px'                                   // Set fixed width for the button
              }}
            >
              <span>Global Intensity</span>
              {/* Right Arrow Icon */}
              <span
                style={{
                  marginLeft: '10px',            // Space between text and arrow
                  fontSize: '20px',              // Arrow size
                }}
              >
                ➡
              </span>
            </button>
          </div>
        </div>

        <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',  // Ensure the container takes up the full width
          paddingTop: '100px'
        }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',  // Ensure the container takes up the full width
              paddingLeft: '150px',   // Left padding
              paddingRight: '150px',  // Right padding
              paddingTop: '20px'

            }}
            >
            <img src="xxx.png" alt="xxx"
            style={{ 
              width: '20%',
            }}/>
            <div
              style={{
                display: 'flex',
                border: '2px solid black',  // Set a solid black border with 2px thickness
                width: '40vw',
                borderRadius: '10px'
              }}
            >
             <h2
              style={{
                fontSize: '1rem',  // Adjust font size as needed
                fontWeight: 'normal',  // Set normal font weight for the entire text
                margin: '15px'
              }}
            >
              <strong>Global Active Power</strong> is the heartbeat of your household's energy use! 
              It tracks how much power is actively being consumed, 
              giving us a window into your daily habits and energy trends.
            </h2>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',  // Ensure the container takes up the full width
              paddingLeft: '150px',   // Left padding
              paddingRight: '150px',  // Right padding
              paddingTop: '30px'

            }}
            >

            <div
              style={{
                display: 'flex',
                border: '2px solid black',  // Set a solid black border with 2px thickness
                width: '40vw',
                borderRadius: '10px'
              }}
            >
             <h2
              style={{
                fontSize: '1rem',  // Adjust font size as needed
                fontWeight: 'normal',  // Set normal font weight for the entire text
                margin: '15px'
              }}
            >
              <strong>Global Reactive Power</strong> is like the unseen rhythm of your energy flow! 
              It measures the power used to maintain the magnetic and electric fields in your appliances.
            </h2>
            </div>
            <img src="xxx.png" alt="xxx"
            style={{ 
              width: '20%',
            }}/>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',  // Ensure the container takes up the full width
              paddingLeft: '150px',   // Left padding
              paddingRight: '150px',  // Right padding
              paddingTop: '30px'
            }}
            >
            <img src="xxx.png" alt="xxx"
            style={{ 
              width: '20%',
            }}/>
            <div
              style={{
                display: 'flex',
                border: '2px solid black',  // Set a solid black border with 2px thickness
                width: '40vw',
                borderRadius: '10px'
              }}
            >
             <h2
              style={{
                fontSize: '1rem',  // Adjust font size as needed
                fontWeight: 'normal',  // Set normal font weight for the entire text
                margin: '15px'
              }}
            >
              <strong>Voltage</strong>  is the pulse of your home's power system, delivering the energy your devices need to thrive! Tracking its patterns helps ensure a steady flow, keeping everything powered up and running like a charm.
            </h2>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',  // Ensure the container takes up the full width
              paddingLeft: '150px',   // Left padding
              paddingRight: '150px',  // Right padding
              paddingTop: '30px'
            }}
            >  
            <div
              style={{
                display: 'flex',
                border: '2px solid black',  // Set a solid black border with 2px thickness
                width: '40vw',
                borderRadius: '10px'
              }}
            >
             <h2
              style={{
                fontSize: '1rem',  // Adjust font size as needed
                fontWeight: 'normal',  // Set normal font weight for the entire text
                margin: '15px'
              }}
            >
              <strong>Global Intensity</strong> is like the pulse of your household's energy flow! 
                It measures the electric current being drawn, showing how much 
                power your appliances and devices are pulling at any moment.
            </h2>
            </div>
            <img src="xxx.png" alt="xxx"
            style={{ 
              width: '20%',
            }}/>
          </div>
        </div>
    </main>
  );
};

export default Home;
