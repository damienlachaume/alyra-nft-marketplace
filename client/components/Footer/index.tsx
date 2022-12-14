const Footer = () => {
  return (
    <footer className="bg-gray-100">
      <div className="container mx-auto max-w-7xl py-20 px-5 pt-10">
        <div className="-mx-5 flex flex-wrap">
          <div className="mb-10 w-full px-5 md:mb-0 md:w-1/3">
            <div className="flex">
              <img
                src="/images/greenloop-logo.png"
                className="mr-3 h-6 sm:h-9"
                alt="Greenloop Logo"
              />
              <span className="self-center whitespace-nowrap text-xl font-semibold">
                Greenloop
              </span>
            </div>
            <p className="mt-5 text-green-600">
              NFT marketplace UI created with Anima for Figma.
            </p>
            <p className="mt-5 text-green-600">Join our community</p>
            {/* List of social networks */}
            <ul className="mt-5 flex space-x-5">
              <li>
                <a
                  href="https://discord.gg/BZZyDA8Cs8"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="/images/discord.png" alt="Discord" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@Alyralecoleblockchain"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="/images/youtube.png" alt="Youtube" />
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/alyraBlockchain"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="/images/twitter.png" alt="Twitter" />
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/alyraBlockchain"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="/images/instagram.png" alt="Instagram" />
                </a>
              </li>
            </ul>
          </div>
          <div className="mb-10 w-full px-5 md:mb-0 md:w-1/3">
            <h3 className="mb-5 text-2xl font-semibold text-green-700">
              Explore
            </h3>
            <ul className="space-y-5">
              <li>
                <a href="#" className="text-green-700 hover:text-green-500">
                  Marketplace
                </a>
              </li>
              <li>
                <a href="#" className="text-green-700 hover:text-green-500">
                  Leaderboard
                </a>
              </li>
              <li>
                <a href="#" className="text-green-700 hover:text-green-500">
                  Connect wallet
                </a>
              </li>
            </ul>
          </div>
          <div className="mb-10 w-full px-5 md:mb-0 md:w-1/3">
            <h3 className="mb-5 text-2xl font-semibold text-green-700">
              Join our weekly digest
            </h3>
            <p className="text-green-700">
              Get exclusive promotions & updates straight to your inbox
            </p>
          </div>
        </div>
        <hr className="my-8" />
        {/* ALl rights reserved */}
        <div className="flex flex-wrap items-center justify-between">
          <div className="w-full text-center md:w-auto md:text-left">
            <p className="text-gray-400">
              © 2022 Greenloop. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
