import Footer from '@/components/Footer';
import Header from '@/components/Header';

const About = () => {
  return (
    <div>
      <Header />
      <main className="relative z-10 mx-10 bg-accent xl:mx-auto">
        <div className="container max-w-7xl">
          <div className="flex flex-row">
            <div className="flex flex-1 flex-col justify-center">
              <img src="/images/trail.png" alt="mint" />
            </div>
            <div className="flex flex-1 flex-col justify-center pl-10">
              <div className="flex flex-1 flex-col">
                <h1 className="mt-10 mb-5 text-4xl font-bold text-green-900 md:mt-20 md:text-6xl">
                  About us and our mission
                </h1>
                <h3 className="mb-10 text-xl font-light text-green-700">
                  We are a team of passionate people who want to change the way
                  we travel and explore the world.
                </h3>
                <div className="mt-2 flex items-center">
                  <img
                    src={`https://i.pravatar.cc/150?u=${Math.random()}`}
                    alt="avatar"
                    className="h-6 w-6 rounded-full"
                  />
                  <p className="ml-2 mt-2">Géraldine HENRY</p>
                </div>
                <div className="mt-2 flex items-center">
                  <img
                    src={`https://i.pravatar.cc/150?u=${Math.random()}`}
                    alt="avatar"
                    className="h-6 w-6 rounded-full"
                  />
                  <p className="ml-2 mt-2">Nathan MASERA</p>
                </div>
                <div className="mt-2 flex items-center">
                  <img
                    src={`https://i.pravatar.cc/150?u=${Math.random()}`}
                    alt="avatar"
                    className="h-6 w-6 rounded-full"
                  />
                  <p className="ml-2 mt-2">Jean-Vincent QUILICHINI</p>
                </div>
                <div className="mt-2 flex items-center">
                  <img
                    src={`https://i.pravatar.cc/150?u=${Math.random()}`}
                    alt="avatar"
                    className="h-6 w-6 rounded-full"
                  />
                  <p className="ml-2 mt-2">Damien LACHAUME</p>
                </div>
                <div className="mt-2 flex items-center">
                  <img
                    src={`https://i.pravatar.cc/150?u=${Math.random()}`}
                    alt="avatar"
                    className="h-6 w-6 rounded-full"
                  />
                  <p className="ml-2 mt-2">Danith YONG</p>
                </div>
                <div className="mt-2 flex items-center">
                  <img
                    src={`https://i.pravatar.cc/150?u=`}
                    alt="avatar"
                    className="h-6 w-6 rounded-full"
                  />
                  <p className="ml-2 mt-2">Gallic GUYOT</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
