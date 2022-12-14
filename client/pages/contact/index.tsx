import Footer from '@/components/Footer';
import Header from '@/components/Header';

const Contact = () => {
  return (
    <div>
      <Header />
      <main className="relative z-10 mx-10 bg-accent xl:mx-auto">
        <div className="container max-w-7xl">
          <div className=" flex items-center justify-center md:flex-row">
            <div className="mb-20 flex flex-1 flex-col justify-center">
              <h1 className="mt-10 mb-5 text-4xl font-bold text-green-900 md:mt-20 md:text-6xl">
                Contact us
              </h1>
              <h3 className="mb-10 text-xl font-light text-green-700">
                Want to get in touch with us? Send us a message!
              </h3>
              <form action="#" className="space-y-8">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900 ">
                    Your email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm   "
                    placeholder="name@flowbite.com"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900 ">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm   "
                    placeholder="Let us know how we can help you"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-900 ">
                    Your message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className="  block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm   "
                    placeholder="Leave a comment..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="mt-10 rounded-full bg-green-500 py-2 px-4 font-bold text-white hover:bg-green-700"
                >
                  Send message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
