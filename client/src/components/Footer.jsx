 function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">

        <div className="grid gap-8 md:grid-cols-2">

          {/* Project Information */}
          <div>
            <h2 className="text-xl font-bold text-white">
              AI Mock Interview
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
              A web-based interview practice platform designed to help
              candidates practice role-specific questions, evaluate their
              answers, and improve their interview performance.
            </p>
          </div>


          {/* Developer Information */}
          <div className="md:text-right">

            <h3 className="font-semibold text-slate-200">
              Developed by Avanish Maurya
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Full Stack Developer
            </p>


            {/* Social Links */}
            <div className="mt-5 flex flex-wrap gap-4 md:justify-end">

              {/* GitHub */}
              <a
                href="https://github.com/avanishmaurya1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-400 transition hover:text-blue-400"
              >
                GitHub
              </a>


              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/avanishmaurya1/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-400 transition hover:text-blue-400"
              >
                LinkedIn
              </a>


              {/* Instagram */}
              <a
                href="https://www.instagram.com/avanish.maurya_47/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-400 transition hover:text-pink-400"
              >
                Instagram
              </a>


              {/* Portfolio */}
              <a
                href="https://portfolio-murex-pi-pf3lr9ec1x.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-400 transition hover:text-blue-400"
              >
                Portfolio
              </a>

            </div>

          </div>

        </div>


        {/* Copyright */}
        <div className="mt-8 border-t border-slate-800 pt-6 text-center">

          <p className="text-xs text-slate-500">
            © 2026 Avanish Maurya. All rights reserved.
          </p>

        </div>

      </div>
    </footer>
  );
}

export default Footer;