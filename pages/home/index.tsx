import { NextPage } from 'next';
import Header from '@components/header/Header';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const router = useRouter();

  const handleLinkClick = (href: string) => {
    router.push(href);
  };

  return (
    <main
      style={{
        backgroundColor: '#FFFBDE',
        minHeight: '100vh', // Fill the full viewport height
        width: '100%',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Header />
      <div style={{ position: 'relative', width: '100%', paddingTop: '70px'}}>
        {/* Background Image Section */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '400px',
          }}
        >
          <Image
            src="/bg.png"
            alt="Description of image"
            layout="fill"
            objectFit="cover"
          />
        </div>

        {/* Text and Button Section */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontWeight: 'normal',
              whiteSpace: 'nowrap',
              fontFamily: 'Istok Web',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            }}
            className="responsive-title"
          >
            WattWise: Power Consumption Monitoring
            <style jsx>{`
              .responsive-title {
                font-size: 3rem;
              }
              @media screen and (max-width: 915px) {
                .responsive-title {
                  font-size: 2rem; /* Adjust font size for tablets */
                }
              }
              @media screen and (max-width: 620px) {
                .responsive-title {
                  font-size: 1rem; /* Adjust font size for mobile */
                  white-space: normal; /* Allow text wrapping */
                }
              }
            `}</style>
          </h1>

          <button
            style={{
              backgroundColor: 'rgba(253, 255, 252, 0.4)',
              color: 'black',
              fontSize: '16px',
              padding: '10px 20px',
              borderRadius: '25px',
              cursor: 'pointer',
              marginTop: '20px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => handleLinkClick('/about')}
          >
            <span>Know More</span>
            <span style={{ marginLeft: '10px', fontSize: '20px' }}>➡</span>
          </button>
        </div>
      </div>

      <h1
        style={{
          padding: '20px',
          color: 'black',
          fontSize: '2rem',
          fontFamily: 'Istok Web',
        }}
      >
        EXPLORE WATT
      </h1>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          width: '80%',
          margin: '0 auto',
        }}
      >
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 'normal',
            textAlign: 'center',
          }}
        >
          WattWise provides detailed insights into household power consumption trends over time, helping both electrical companies and consumers identify patterns in energy usage.
        </h2>
      </div>

      <h1
        style={{
          padding: '20px',
          color: 'black',
          fontSize: '2rem',
          fontFamily: 'Istok Web',
          paddingTop: '100px',
        }}
      >
        METRICS OVERVIEW
      </h1>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '1200px',
          margin: '15px',
        }}
      >
        {[
          {
            title: 'Global Active Power',
            description:
              'Global Active Power is the heartbeat of your household’s energy use!',
          },
          {
            title: 'Global Reactive Power',
            description:
              'Global Reactive Power measures the power used to maintain the magnetic and electric fields in your appliances.',
          },
          {
            title: 'Voltage',
            description:
              'Voltage delivers the energy your devices need to thrive, ensuring a steady flow!',
          },
          {
            title: 'Global Intensity',
            description:
              'Global Intensity measures the electric current being drawn by your appliances and devices.',
          },
        ].map((metric, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              border: '2px solid black',
              width: 'calc(25% - 20px)', // 25% width for 1x4 layout
              maxWidth: '300px',
              minWidth: '200px',
              height: 'auto',
              borderRadius: '10px',
              padding: '15px',
              boxSizing: 'border-box',
            }}
          >
            <h2
              style={{
                fontSize: '1rem',
                fontWeight: 'bold',
                marginBottom: '10px',
              }}
            >
              {metric.title}
            </h2>
            <p
              style={{
                fontSize: '0.9rem',
                fontWeight: 'normal',
              }}
            >
              {metric.description}
            </p>
          </div>
        ))}
        <style jsx>{`
          @media screen and (max-width: 768px) {
            div > div {
              width: calc(50% - 20px); /* Switch to 2x2 layout for smaller screens */
            }
          }
          @media screen and (max-width: 480px) {
            div > div {
              width: 100%; /* Switch to single column layout on very small screens */
            }
          }
        `}</style>
      </div>
    </main>
  );
};

export default Home;
