import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useContract, useSigner } from '@thirdweb-dev/react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const Header = () => {
  const { data } = useSession();

  const { contract } = useContract(
    '0x0A2Ffea2DF15EDBeB44BaB96a3fcE8b5dec991D6',
  );

  const signer = useSigner();

  const getFaucet = async () => {
    try {
      await contract?.call('faucet', signer?.getAddress());
    } catch (error) {
      alert(
        'You already have claim some tokens from the faucet Wait one hour before trying again.',
      );
    }
  };

  return (
    <nav className="rounded border-gray-200 bg-white px-2 py-2.5 sm:px-4">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <Link className="flex items-center" href="/">
          <img
            src="/images/greenloop-logo.png"
            className="mr-3 h-6 sm:h-9"
            alt="Greenloop Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold text-green-800">
            Greenloop
          </span>
        </Link>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="ml-3 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="h-6 w-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="mt-4 flex flex-col items-center justify-center rounded-lg border border-gray-100 bg-gray-50 p-4  md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:text-sm md:font-medium ">
            <li className="flex items-center justify-center">
              {data?.address && (
                <a
                  onClick={getFaucet}
                  className="ml-2 mr-3 cursor-pointer rounded-xl bg-gray-900 p-2 py-3 text-xs text-white"
                >
                  Get faucet Greencoin 💰
                </a>
              )}
              <a
                href="#"
                className="block rounded bg-green-700 py-2 pl-3 pr-4 text-white md:bg-transparent md:p-0 md:text-green-700"
                aria-current="page"
              >
                <ConnectButton label={'Connect your wallet'} />
              </a>
            </li>
            {data?.address && (
              <li>
                <Link
                  href="/trails/inventory"
                  className="block rounded-xl bg-green-700 py-2 pl-3 pr-4 text-white"
                >
                  My trails 🏃‍♂️
                </Link>
              </li>
            )}
            <li>
              <Link
                href="/"
                className="block rounded py-2 pl-3 pr-4 text-gray-700 hover:bg-gray-100  md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-green-700"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/trails"
                className="block rounded py-2 pl-3 pr-4 text-gray-700 hover:bg-gray-100  md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-green-700"
              >
                Explore
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="block rounded py-2 pl-3 pr-4 text-gray-700 hover:bg-gray-100 md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-green-700 md:dark:hover:bg-transparent"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="block rounded py-2 pl-3 pr-4 text-gray-700 hover:bg-gray-100 md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-green-700 md:dark:hover:bg-transparent"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
