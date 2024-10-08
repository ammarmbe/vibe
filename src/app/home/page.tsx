import React from "react";
import { jetBrains } from "@/components/Header/Header";
import {
  BellRing,
  Database,
  MessageSquarePlus,
  Sparkles,
  UserCircle2,
  Users2,
} from "lucide-react";
import styles from "./Page.module.css";
import Link from "@/components/Link";

export default function Home() {
  return (
    <>
      <main className="mx-8">
        <section
          className={`min-h-screen flex items-center justify-center flex-col text-center ${styles.hero}`}
        >
          <p className="md:text-5xl text-3xl font-semibold text-secondary-foreground">
            Welcome to
          </p>
          <h1
            className={`${jetBrains.className} ${styles.title} select-none -z-10 text-[max(30vw,132px)] leading-none font-extrabold italic tracking-tighter bg-gradient-to-t from-main/30 to-main bg-clip-text text-transparent`}
          >
            Vibe
          </h1>
          <Link
            className="border px-2.5 py-1.5 mt-6 hover:border-main/50 text-lg font-semibold rounded-full hover:shadow-[0px_0px_25px_0px_main] hover:shadow-main/30"
            href="/"
          >
            Visit App
          </Link>
        </section>
        <section
          id="features"
          className="min-h-screen flex flex-col items-center justify-center"
        >
          <h2
            className={`md:text-4xl text-3xl text-center ${jetBrains.className} tracking-tighter font-bold my-8`}
          >
            Features
          </h2>
          <ul className="grid grid-cols-1 grid-rows-6 md:grid-cols-3 md:grid-rows-2 gap-8 max-w-7xl mx-auto">
            <li className="flex flex-col gap-2.5 p-6 border text-center rounded-md shadow-md">
              <div className="w-full flex mb-3.5 justify-center">
                <UserCircle2 className="text-main" size={64} />
              </div>
              <h3
                className={`md:text-3xl text-2xl ${jetBrains.className} text-main font-bold`}
              >
                User Registration and Login
              </h3>
              <p className="text-lg">
                Users can create an account and login to the website.
              </p>
            </li>
            <li className="flex flex-col gap-2.5 p-6 border text-center rounded-md shadow-md">
              <div className="w-full flex mb-3.5 justify-center">
                <Database className="text-main" size={64} />
              </div>
              <h3
                className={`md:text-3xl text-2xl ${jetBrains.className} text-main font-bold`}
              >
                Create, Read, Update, Delete
              </h3>
              <p className="text-lg">
                Users can create posts, read posts from other users, and edit or
                delete their own posts.
              </p>
            </li>
            <li className="flex flex-col gap-2.5 p-6 border text-center rounded-md shadow-md">
              <div className="w-full flex mb-3.5 justify-center">
                <MessageSquarePlus className="text-main" size={64} />
              </div>
              <h3
                className={`md:text-3xl text-2xl ${jetBrains.className} text-main font-bold`}
              >
                Comments, Likes, Profiles
              </h3>
              <p className="text-lg">
                Users can like and comment on posts. They can also view their
                own and other users' profiles.
              </p>
            </li>
            <li className="flex flex-col gap-2.5 p-6 border text-center rounded-md shadow-md">
              <div className="w-full flex mb-3.5 justify-center">
                <Users2 className="text-main" size={64} />
              </div>
              <h3
                className={`md:text-3xl text-2xl ${jetBrains.className} text-main font-bold`}
              >
                Following other Users
              </h3>
              <p className="text-lg">
                users can follow others and see their posts in the "Following"
                feed.
              </p>
            </li>
            <li className="flex flex-col gap-2.5 p-6 border text-center rounded-md shadow-md">
              <div className="w-full flex mb-3.5 justify-center">
                <BellRing className="text-main" size={64} />
              </div>
              <h3
                className={`md:text-3xl text-2xl ${jetBrains.className} text-main font-bold`}
              >
                Real-time Notifications
              </h3>
              <p className="text-lg">
                Users get notified when someone likes their post or follows
                them.
              </p>
            </li>
            <li className="flex flex-col gap-2.5 p-6 border text-center rounded-md shadow-md">
              <div className="w-full flex mb-3.5 justify-center">
                <Sparkles className="text-main" size={64} />
              </div>
              <h3
                className={`md:text-3xl text-2xl ${jetBrains.className} text-main font-bold`}
              >
                Responsive Design and Animations
              </h3>
              <p className="text-lg">
                The website is built with a beautiful mobile first design, which
                also works on larger desktop monitors.
              </p>
            </li>
          </ul>
        </section>
        <section className="min-h-screen flex flex-col items-center justify-center mb-6">
          <h2
            className={`md:text-4xl text-3xl text-center ${jetBrains.className} tracking-tighter font-bold my-8`}
          >
            Stack
          </h2>
          <ul className="grid grid-cols-1 grid-rows-6 md:grid-cols-3 md:grid-rows-2 gap-8 max-w-7xl mx-auto text-primary">
            <li>
              <Link
                href="https://nextjs.org"
                className="flex hover:border-main hover:shadow-main/30 flex-col gap-8 p-6 border text-center items-center rounded-md hover:shadow-[0px_0px_25px_0px_main] transition-all duration-100"
              >
                <div className="md:h-[80px] md:w-[80px] w-[60%] aspect-square">
                  <svg
                    width="50"
                    height="50"
                    className="h-full w-full"
                    viewBox="0 0 50 50"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Nextjs</title>
                    <g clipPath="url(#clip0_11_135)">
                      <path
                        d="M24.1073 6.72777e-05C23.7406 6.72777e-05 23.4614 0.00215061 23.3614 0.0146506C23.1088 0.0399046 22.856 0.0628222 22.603 0.0834005C15.5048 0.7209 8.85245 4.55215 4.63978 10.4417C2.31004 13.6741 0.795505 17.4213 0.225009 21.3646C0.025001 22.7375 0 23.1438 0 25.0042C0 26.8646 0.025001 27.2729 0.225009 28.6459C1.5834 38.0334 8.26701 45.9208 17.3278 48.8438C18.9508 49.3646 20.6613 49.7229 22.6072 49.9375C23.3635 50.0208 26.6386 50.0208 27.397 49.9375C30.7534 49.5667 33.5993 48.7354 36.4036 47.3042C36.8349 47.0833 36.9182 47.025 36.8599 46.975C36.8182 46.9479 34.9848 44.4896 32.7868 41.5167L28.7887 36.1167L23.7802 28.7042C22.1138 26.2241 20.4318 23.7546 18.7341 21.2959C18.7154 21.2917 18.6966 24.5855 18.6862 28.6084C18.6716 35.65 18.6654 35.9313 18.5779 36.0979C18.4929 36.2932 18.3406 36.4515 18.1487 36.5438C17.9924 36.6209 17.857 36.6354 17.1174 36.6354H16.2694L16.0444 36.4938C15.9053 36.4066 15.7923 36.2835 15.7173 36.1375L15.6131 35.9167L15.6257 26.1188L15.6402 16.3167L15.7902 16.125C15.8927 16.0052 16.0154 15.9044 16.1528 15.8271C16.3528 15.7292 16.4319 15.7209 17.2778 15.7209C18.2737 15.7209 18.4403 15.7584 18.6987 16.0417C18.7716 16.1209 21.4842 20.2063 24.7302 25.1271C28.0165 30.1076 31.3049 35.0868 34.5952 40.0646L38.5537 46.0625L38.7537 45.9313C40.6595 44.6649 42.3874 43.1494 43.8914 41.425C47.0411 37.8199 49.0839 33.3828 49.775 28.6459C49.975 27.2709 50 26.8667 50 25.0042C50 23.1438 49.975 22.7375 49.775 21.3646C48.4166 11.9771 41.7351 4.08965 32.6743 1.16673C30.9802 0.628156 29.2357 0.263088 27.4678 0.0771505C26.3491 0.0242054 25.2293 -0.00149664 24.1093 6.72777e-05H24.1073ZM32.5847 15.0355C33.3076 15.0355 33.4347 15.0459 33.5972 15.1334C33.7136 15.1921 33.8172 15.2734 33.9019 15.3724C33.9867 15.4715 34.051 15.5864 34.091 15.7105C34.1285 15.8355 34.1389 18.5542 34.1285 24.6771L34.116 33.4646L32.5659 31.0896L31.0117 28.7146V22.3271C31.0117 18.198 31.0325 15.875 31.0596 15.7646C31.0945 15.6343 31.1556 15.5125 31.239 15.4065C31.3225 15.3005 31.4266 15.2125 31.5451 15.148C31.7451 15.0438 31.8159 15.0355 32.5868 15.0355H32.5847Z"
                        fill="currentColor"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_11_135">
                        <rect width="50" height="50" fill="currentColor" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold">Next.js</h3>
              </Link>
            </li>

            <li>
              <Link
                href="https://react.dev/"
                className="flex hover:border-main hover:shadow-main/30 flex-col gap-8 p-6 border text-center items-center rounded-md hover:shadow-[0px_0px_25px_0px_main] transition-all duration-100"
              >
                <div className="md:h-[80px] md:w-[80px] w-[60%] aspect-square">
                  <svg
                    width="54"
                    height="54"
                    viewBox="0 0 54 54"
                    fill="currentColor"
                    className="h-full w-full"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>React</title>
                    <g clipPath="url(#clip0_11_130)">
                      <path
                        d="M27 32.6852C29.8404 32.6852 32.1429 30.3637 32.1429 27.5C32.1429 24.6363 29.8404 22.3148 27 22.3148C24.1597 22.3148 21.8572 24.6363 21.8572 27.5C21.8572 30.3637 24.1597 32.6852 27 32.6852Z"
                        fill="currentColor"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M24.243 8.55078C20.1745 5.59532 16.8419 4.97335 14.7857 6.17026C12.7295 7.36717 11.5974 10.588 12.1017 15.6182C12.1339 15.9389 12.1726 16.2647 12.2178 16.5953C14.5347 15.883 17.0993 15.3361 19.8336 14.9857C21.5017 12.7733 23.2539 10.8075 25.0242 9.14064C24.7629 8.93587 24.5024 8.73919 24.243 8.55078ZM27 7.41057C26.5814 7.07153 26.1632 6.7502 25.7462 6.44729C21.5344 3.38779 16.9783 1.90026 13.4999 3.92501C10.0216 5.94976 9.02127 10.6717 9.54336 15.879C9.59505 16.3946 9.66195 16.9204 9.7439 17.4554C9.24341 17.6514 8.75832 17.8559 8.28964 18.0685C3.55579 20.2163 0 23.4507 0 27.5002C0 31.5497 3.55579 34.7841 8.28964 36.9319C8.75831 37.1445 9.2434 37.349 9.74388 37.545C9.66194 38.08 9.59505 38.6058 9.54336 39.1213C9.02127 44.3286 10.0216 49.0505 13.4999 51.0753C16.9783 53.1 21.5344 51.6125 25.7462 48.553C26.1632 48.2501 26.5814 47.9288 27 47.5897C27.4185 47.9288 27.8367 48.2501 28.2537 48.553C32.4655 51.6125 37.0216 53.1 40.5 51.0753C43.9783 49.0505 44.9786 44.3286 44.4565 39.1213C44.4049 38.6058 44.338 38.08 44.256 37.545C44.7565 37.3491 45.2417 37.1446 45.7104 36.9319C50.4442 34.7841 54 31.5497 54 27.5002C54 23.4507 50.4442 20.2163 45.7104 18.0685C45.2417 17.8559 44.7565 17.6514 44.256 17.4554C44.338 16.9204 44.4048 16.3946 44.4565 15.879C44.9786 10.6717 43.9783 5.94976 40.5 3.92501C37.0216 1.90026 32.4655 3.38779 28.2537 6.44729C27.8367 6.7502 27.4185 7.07153 27 7.41057ZM27 10.8294C25.7913 11.9483 24.5798 13.2273 23.3926 14.6486C24.5737 14.5751 25.778 14.5372 27 14.5372C28.222 14.5372 29.4263 14.5751 30.6073 14.6486C29.4201 13.2273 28.2086 11.9483 27 10.8294ZM34.1663 14.9857C32.4981 12.7733 30.746 10.8075 28.9757 9.14064C29.237 8.93587 29.4975 8.73919 29.7569 8.55078C33.8254 5.59532 37.158 4.97335 39.2142 6.17026C41.2704 7.36717 42.4025 10.588 41.8982 15.6182C41.866 15.9389 41.8273 16.2647 41.7821 16.5953C39.4652 15.883 36.9006 15.336 34.1663 14.9857ZM32.7658 17.4313C30.9194 17.2346 28.9891 17.1298 27 17.1298C25.0108 17.1298 23.0806 17.2346 21.2341 17.4313C20.1419 18.9452 19.0868 20.5782 18.0923 22.315C17.0977 24.0518 16.2225 25.7895 15.4683 27.5002C16.2225 29.2108 17.0977 30.9485 18.0923 32.6853C19.0868 34.4222 20.1419 36.0552 21.2342 37.5691C23.0806 37.7659 25.0109 37.8706 27 37.8706C28.9891 37.8706 30.9193 37.7659 32.7657 37.5692C33.858 36.0552 34.9131 34.4222 35.9076 32.6853C36.9022 30.9485 37.7774 29.2108 38.5316 27.5002C37.7774 25.7895 36.9022 24.0518 35.9076 22.315C34.9131 20.5782 33.858 18.9452 32.7658 17.4313ZM39.8425 24.2241C39.3152 23.1561 38.7456 22.0857 38.1346 21.0187C37.5236 19.9517 36.8889 18.9191 36.2353 17.9247C38.0497 18.2506 39.754 18.6689 41.3194 19.1648C40.9627 20.7796 40.4698 22.4768 39.8425 24.2241ZM39.8425 30.7762C39.3152 31.8442 38.7456 32.9146 38.1346 33.9816C37.5235 35.0487 36.8889 36.0813 36.2352 37.0757C38.0497 36.7498 39.754 36.3315 41.3194 35.8356C40.9627 34.2208 40.4698 32.5235 39.8425 30.7762ZM43.7579 34.9548C43.2113 32.5757 42.3988 30.0629 41.3326 27.5002C42.3988 24.9375 43.2113 22.4247 43.7578 20.0456C44.0644 20.1714 44.3636 20.3005 44.6551 20.4328C49.228 22.5075 51.4286 25.1064 51.4286 27.5002C51.4286 29.894 49.228 32.4929 44.6551 34.5677C44.3636 34.6999 44.0644 34.829 43.7579 34.9548ZM41.7821 38.4051C39.4652 39.1174 36.9006 39.6644 34.1662 40.0148C32.4981 42.2271 30.746 44.1929 28.9757 45.8597C29.237 46.0644 29.4975 46.2611 29.7569 46.4495C33.8254 49.405 37.158 50.0269 39.2142 48.83C41.2704 47.6331 42.4025 44.4123 41.8982 39.3821C41.866 39.0614 41.8273 38.7357 41.7821 38.4051ZM27 44.1709C28.2086 43.0521 29.42 41.7731 30.6072 40.3518C29.4262 40.4253 28.222 40.4632 27 40.4632C25.778 40.4632 24.5737 40.4253 23.3927 40.3518C24.5799 41.7731 25.7913 43.0521 27 44.1709ZM17.7647 37.0757C17.111 36.0812 16.4764 35.0487 15.8653 33.9816C15.2543 32.9146 14.6847 31.8442 14.1574 30.7762C13.5301 32.5235 13.0372 34.2208 12.6805 35.8356C14.2459 36.3315 15.9502 36.7498 17.7647 37.0757ZM12.2178 38.4051C14.5347 39.1174 17.0993 39.6644 19.8337 40.0148C21.5018 42.2271 23.2539 44.1929 25.0242 45.8597C24.7629 46.0644 24.5024 46.2611 24.243 46.4495C20.1745 49.405 16.8419 50.0269 14.7857 48.83C12.7295 47.6331 11.5974 44.4123 12.1017 39.3821C12.1339 39.0614 12.1726 38.7356 12.2178 38.4051ZM10.242 34.9548C10.7886 32.5757 11.6011 30.0629 12.6673 27.5002C11.6011 24.9375 10.7886 22.4247 10.2421 20.0456C9.93553 20.1714 9.63637 20.3005 9.34487 20.4328C4.77198 22.5075 2.57143 25.1064 2.57143 27.5002C2.57143 29.894 4.77198 32.4929 9.34487 34.5677C9.63636 34.6999 9.93552 34.829 10.242 34.9548ZM12.6806 19.1649C13.0372 20.7796 13.5301 22.4768 14.1574 24.2241C14.6847 23.1561 15.2543 22.0857 15.8653 21.0187C16.4763 19.9517 17.1109 18.9192 17.7646 17.9247C15.9502 18.2507 14.2459 18.6689 12.6806 19.1649Z"
                        fill="currentColor"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_11_130">
                        <rect
                          width="54"
                          height="49"
                          fill="currentColor"
                          transform="translate(0 3)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold">React</h3>
              </Link>
            </li>
            <li>
              <Link
                href="https://planetscale.com/docs/tutorials/planetscale-serverless-driver"
                className="flex hover:border-main hover:shadow-main/30 flex-col gap-8 p-6 border text-center items-center rounded-md hover:shadow-[0px_0px_25px_0px_main] transition-all duration-100"
              >
                <div className="md:h-[80px] md:w-[80px] w-[60%] aspect-square p-2">
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 36 36"
                    className="h-full w-full"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0 6.207C0 4.5608 0.65395 2.98203 1.81799 1.81799C2.98203 0.65395 4.5608 0 6.207 0L29.793 0C31.4392 0 33.018 0.65395 34.182 1.81799C35.346 2.98203 36 4.5608 36 6.207V26.267C36 29.813 31.512 31.352 29.336 28.553L22.531 19.799V30.414C22.531 31.8955 21.9425 33.3163 20.8949 34.3639C19.8473 35.4115 18.4265 36 16.945 36H6.207C4.5608 36 2.98203 35.346 1.81799 34.182C0.65395 33.018 0 31.4392 0 29.793L0 6.207ZM6.207 4.966C5.521 4.966 4.966 5.521 4.966 6.206V29.793C4.966 30.479 5.521 31.035 6.206 31.035H17.131C17.474 31.035 17.565 30.757 17.565 30.414V16.18C17.565 12.633 22.053 11.094 24.23 13.894L31.035 22.647V6.207C31.035 5.521 31.099 4.966 30.414 4.966H6.207Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold">Neon (PostgreSQL)</h3>
              </Link>
            </li>
            <li>
              <Link
                href="https://clerk.com/"
                className="flex hover:border-main hover:shadow-main/30 flex-col gap-8 p-6 border text-center items-center rounded-md hover:shadow-[0px_0px_25px_0px_main] transition-all duration-100"
              >
                <div className="md:h-[80px] md:w-[80px] w-[60%] aspect-square">
                  <svg
                    width="50"
                    height="50"
                    viewBox="0 0 50 50"
                    className="h-full w-full"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Clerk</title>
                    <path
                      d="M44.6497 6.55636L38.6748 12.5314C38.4871 12.719 38.2417 12.838 37.9783 12.8695C37.7147 12.9011 37.4484 12.8432 37.2217 12.7052C34.8714 11.2873 32.1609 10.5801 29.4174 10.6691C26.6739 10.7581 24.0151 11.6394 21.7616 13.2067C20.3756 14.1715 19.1722 15.3749 18.2075 16.7609C16.6422 19.0159 15.7617 21.6751 15.6721 24.4187C15.5824 27.1624 16.2873 29.8735 17.7021 32.2259C17.8391 32.4522 17.8964 32.7177 17.8649 32.9805C17.8334 33.2431 17.7149 33.4877 17.5283 33.6752L11.5536 39.6501C11.4333 39.7713 11.2882 39.865 11.1283 39.9248C10.9684 39.9847 10.7975 40.0092 10.6272 39.9969C10.457 39.9845 10.2914 39.9355 10.1418 39.8532C9.99228 39.7708 9.86229 39.6572 9.76076 39.5199C6.52804 35.0761 4.85738 29.6872 5.00955 24.1941C5.16171 18.701 7.12813 13.4128 10.6019 9.15488C11.6624 7.85213 12.8532 6.66119 14.1559 5.60066C18.4132 2.12766 23.7004 0.161715 29.1924 0.00954853C34.6844 -0.142618 40.0722 1.52756 44.5153 4.75948C44.6536 4.86068 44.7681 4.99066 44.8511 5.14042C44.9342 5.29018 44.9838 5.45616 44.9967 5.62696C45.0095 5.79776 44.9851 5.9693 44.9251 6.12974C44.8652 6.29019 44.7712 6.43574 44.6497 6.55636Z"
                      fill="currentColor"
                    />
                    <path
                      d="M44.6428 43.4437L38.7205 37.4882C38.5345 37.3013 38.2912 37.1826 38.0301 37.1512C37.769 37.1198 37.5048 37.1775 37.2801 37.315C35.0836 38.6474 32.5669 39.3518 30.0017 39.3518C27.4363 39.3518 24.9197 38.6474 22.7231 37.315C22.4984 37.1775 22.2343 37.1198 21.9731 37.1512C21.7119 37.1826 21.4688 37.3013 21.2827 37.4882L15.3604 43.4437C15.2362 43.5636 15.1398 43.7098 15.0781 43.8715C15.0163 44.0331 14.9907 44.2066 15.003 44.3794C15.0153 44.5523 15.0653 44.7202 15.1494 44.8713C15.2335 45.0226 15.3496 45.1533 15.4896 45.2542C19.7052 48.3386 24.7844 50 29.9978 50C35.211 50 40.2902 48.3386 44.5059 45.2542C44.6463 45.1539 44.7631 45.0237 44.848 44.8727C44.9327 44.7218 44.9835 44.5541 44.9967 44.3813C45.0096 44.2085 44.9847 44.0348 44.9237 43.8729C44.8624 43.7108 44.7666 43.5642 44.6428 43.4437Z"
                      fill="currentColor"
                    />
                    <path
                      d="M30 32.1429C33.9447 32.1429 37.1429 28.9449 37.1429 24.9999C37.1429 21.0552 33.9447 17.8571 30 17.8571C26.055 17.8571 22.8571 21.0552 22.8571 24.9999C22.8571 28.9449 26.055 32.1429 30 32.1429Z"
                      fill="currentColor"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_11_133"
                        x1="39.0343"
                        y1="-4.56031"
                        x2="-22.4187"
                        y2="44.6032"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="white" />
                        <stop offset="0.5" stopColor="white" />
                        <stop offset="1" stopColor="white" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold">Clerk</h3>
              </Link>
            </li>
            <li>
              <Link
                href="https://tailwindcss.com/"
                className="flex hover:border-main hover:shadow-main/30 flex-col gap-8 p-6 border text-center items-center rounded-md hover:shadow-[0px_0px_25px_0px_main] transition-all duration-100"
              >
                <div className="md:h-[80px] md:w-[80px] w-[60%] aspect-square">
                  <svg
                    width="60"
                    height="60"
                    viewBox="0 0 60 60"
                    fill="currentColor"
                    className="h-full w-full"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Tailwind CSS</title>
                    <path
                      d="M30 12C22 12 17 16 15 24C18 20 21.5 18.5 25.5 19.5C27.7825 20.07 29.4125 21.725 31.22 23.56C34.1625 26.545 37.565 30 45 30C53 30 58 26 60 18C57 22 53.5 23.5 49.5 22.5C47.2175 21.93 45.5875 20.275 43.78 18.44C40.84 15.455 37.4375 12 30 12ZM15 30C7 30 2 34 0 42C3 38 6.5 36.5 10.5 37.5C12.7825 38.07 14.4125 39.725 16.22 41.56C19.1625 44.545 22.565 48 30 48C38 48 43 44 45 36C42 40 38.5 41.5 34.5 40.5C32.2175 39.93 30.5875 38.275 28.78 36.44C25.84 33.455 22.4375 30 15 30Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold">Tailwind CSS</h3>
              </Link>
            </li>
            <li>
              <Link
                href="https://tanstack.com/query/latest"
                className="flex hover:border-main hover:shadow-main/30 flex-col gap-8 p-6 border text-center items-center rounded-md hover:shadow-[0px_0px_25px_0px_main] transition-all duration-100"
              >
                <div className="md:h-[80px] md:w-[80px] w-[60%] aspect-square">
                  <svg
                    width="50"
                    height="50"
                    viewBox="0 0 50 50"
                    fill="currentColor"
                    className="h-full w-full"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>React Query</title>
                    <path
                      d="M10.4537 16.591C9.6398 12.6255 9.46513 9.58397 9.99122 7.37542C10.3041 6.0619 10.8761 4.99035 11.7459 4.21724C12.6642 3.40104 13.8253 3.00053 15.1298 3.00053C17.2819 3.00053 19.5443 3.98664 21.962 5.86C22.9482 6.6241 23.9717 7.54511 25.0346 8.62354C25.1192 8.5141 25.2149 8.41087 25.3214 8.31546C28.3266 5.62455 30.8566 3.95266 33.0206 3.30803C34.3073 2.92473 35.5154 2.88821 36.6155 3.26021C37.7767 3.65289 38.702 4.4646 39.3548 5.60156C40.4322 7.47794 40.7163 9.94353 40.3146 12.9879C40.1509 14.2288 39.871 15.5805 39.4756 17.0451C39.6247 17.0632 39.7743 17.0965 39.9224 17.1458C43.7352 18.4154 46.4352 19.7807 48.0697 21.341C49.0423 22.2694 49.6774 23.3029 49.9069 24.447C50.1493 25.6545 49.913 26.8657 49.2609 28.0018C48.1856 29.8755 46.2083 31.3532 43.3915 32.5237C42.2604 32.9937 40.9807 33.4194 39.5509 33.8022C39.6161 33.9502 39.6667 34.1074 39.7006 34.2723C40.5144 38.2378 40.6891 41.2793 40.163 43.4878C39.8501 44.8014 39.2781 45.8729 38.4083 46.646C37.49 47.4622 36.329 47.8627 35.0244 47.8627C32.8723 47.8627 30.61 46.8766 28.1922 45.0033C27.1956 44.231 26.1608 43.2985 25.0856 42.2052C24.975 42.3791 24.8392 42.5407 24.6786 42.6845C21.6734 45.3755 19.1434 47.0473 16.9794 47.692C15.6927 48.0753 14.4846 48.1118 13.3845 47.7398C12.2233 47.3471 11.298 46.5354 10.6452 45.3984C9.56782 43.5221 9.28371 41.0565 9.68537 38.0121C9.85501 36.7263 10.1494 35.3216 10.5678 33.7956C10.4042 33.779 10.24 33.7442 10.0776 33.6901C6.26476 32.4205 3.56485 31.0552 1.93026 29.4949C0.957719 28.5665 0.322639 27.533 0.0930619 26.3889C-0.149257 25.1814 0.0870228 23.9702 0.739066 22.8341C1.81442 20.9604 3.79167 19.4827 6.60853 18.3122C7.77329 17.8282 9.09572 17.3912 10.5774 16.9996C10.5246 16.8698 10.4829 16.7332 10.4537 16.591Z"
                      fill="transparent"
                    />
                    <path
                      d="M37.0404 34.6621C37.4196 34.5946 37.7828 34.8388 37.8675 35.2135L37.8721 35.2357L37.9125 35.4466C39.2231 42.3697 38.2999 45.8313 35.1431 45.8313C32.0544 45.8313 28.1226 42.8776 23.3476 36.97C23.2421 36.8395 23.1852 36.6761 23.1866 36.5079C23.1901 36.1162 23.5029 35.8 23.89 35.7915L23.9124 35.7914L24.1638 35.7932C26.1732 35.8041 28.1265 35.7337 30.0239 35.582C32.2637 35.4029 34.6026 35.0962 37.0404 34.6621ZM15.3605 29.4289L15.3726 29.4494L15.4988 29.6707C16.5099 31.437 17.5633 33.1134 18.6591 34.7C19.9496 36.5685 21.4007 38.46 23.0126 40.3746C23.262 40.6708 23.2335 41.1104 22.9522 41.3719L22.9339 41.3883L22.7717 41.5286C17.4385 46.1203 13.9722 47.0369 12.3726 44.2785C10.8069 41.5785 11.3746 36.6691 14.0756 29.5502C14.1349 29.3938 14.2465 29.2629 14.3912 29.1799C14.7294 28.986 15.1581 29.098 15.3605 29.4289ZM39.7468 19.2131L39.7686 19.2203L39.9694 19.2899C46.5523 21.5909 49.0533 24.1196 47.4725 26.876C45.9263 29.5719 41.4314 31.5347 33.9879 32.7644C33.8219 32.7919 33.6516 32.76 33.5066 32.6743C33.164 32.472 33.0496 32.0289 33.251 31.6848C34.3171 29.8625 35.2773 28.0493 36.1316 26.2453C37.1004 24.1993 38.0096 22.0031 38.8592 19.6569C38.988 19.3012 39.3664 19.108 39.7248 19.2067L39.7468 19.2131ZM16.4935 18.0546C16.836 18.257 16.9504 18.7 16.749 19.0442C15.6829 20.8664 14.7227 22.6796 13.8684 24.4836C12.8996 26.5297 11.9904 28.7258 11.1408 31.072C11.0093 31.435 10.618 31.6287 10.2532 31.5158L10.2314 31.5086L10.0307 31.439C3.4477 29.138 0.946657 26.6093 2.52754 23.8529C4.0737 21.1571 8.56856 19.1943 16.0121 17.9645C16.1781 17.9371 16.3484 17.969 16.4935 18.0546ZM37.6274 6.72146C39.1931 9.4215 38.6254 14.3309 35.9244 21.4498C35.8651 21.6062 35.7535 21.7371 35.6088 21.8201C35.2706 22.014 34.8419 21.902 34.6395 21.5711L34.6274 21.5506L34.5012 21.3293C33.4901 19.563 32.4367 17.8866 31.3409 16.3C30.0504 14.4315 28.5993 12.54 26.9874 10.6254C26.738 10.3292 26.7665 9.8896 27.0478 9.62814L27.0661 9.6117L27.2283 9.47143C32.5615 4.87972 36.0278 3.96306 37.6274 6.72146ZM15.1267 5.07831C18.2154 5.07831 22.1472 8.03209 26.9221 13.9396C27.0276 14.0702 27.0846 14.2336 27.0832 14.4017C27.0797 14.7934 26.7669 15.1096 26.3798 15.1181L26.3574 15.1182L26.1059 15.1165C24.0966 15.1055 22.1432 15.1759 20.2458 15.3276C18.0061 15.5068 15.6672 15.8134 13.2293 16.2475C12.8502 16.315 12.4869 16.0708 12.4023 15.6961L12.3976 15.6739L12.3573 15.4631C11.0467 8.5399 11.9699 5.07831 15.1267 5.07831Z"
                      fill="currentColor"
                    />
                    <path
                      d="M21.7372 17.4578H27.9044C28.8063 17.4578 29.6393 17.9425 30.0883 18.7286L33.1849 24.1503C33.6304 24.9302 33.6304 25.8891 33.1849 26.669L30.0883 32.0907C29.6393 32.8767 28.8063 33.3614 27.9044 33.3614H21.7372C20.8353 33.3614 20.0023 32.8767 19.5533 32.0907L16.4567 26.669C16.0113 25.8891 16.0113 24.9302 16.4567 24.1503L19.5533 18.7286C20.0023 17.9425 20.8353 17.4578 21.7372 17.4578Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold">React Query</h3>
              </Link>
            </li>
          </ul>
          <p className="mt-6">
            <em>
              <Link
                href="https://ui.shadcn.com/"
                className="underline hover:text-[#d43232]"
              >
                Shadcn/ui
              </Link>{" "}
              is used for the popover and dialog components and the CSS
              variables.
            </em>
          </p>
        </section>
      </main>
      <footer>
        <p className="p-2.5 text-center">
          Built by{" "}
          <Link
            href="https://www.github.com/ammarmbe"
            className="underline hover:text-[#d43232]"
          >
            Ammar Elbehery
          </Link>
          , deployed on{" "}
          <Link
            href="https://www.vercel.com"
            className="underline hover:text-[#d43232]"
          >
            Vercel
          </Link>{" "}
          and{" "}
          <Link
            href="https://www.neon.tech"
            className="underline hover:text-[#d43232]"
          >
            Neon
          </Link>
          . Code available on{" "}
          <Link
            href="https://github.com/ammarmbe/vibe-2.0"
            className="underline hover:text-[#d43232]"
          >
            GitHub
          </Link>
          .{" "}
          <Link href="/privacy" className="underline hover:text-[#d43232]">
            Privacy policy
          </Link>
          .
        </p>
      </footer>
    </>
  );
}
