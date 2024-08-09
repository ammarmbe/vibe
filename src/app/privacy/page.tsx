import Link from "next/link";
import { jetBrains } from "@/components/Header/Header";

export default function Page() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col p-4 sm:px-8">
      <div className="flex flex-none items-center justify-center py-8">
        <Link
          href="/"
          className={`text-main select-none italic font-extrabold text-3xl tracking-tighter ${jetBrains.className}`}
        >
          V
        </Link>
      </div>
      <h1 className="pt-4 text-2xl font-semibold sm:pt-8 md:text-3xl">
        Privacy Policy
      </h1>
      <p className="pt-4 text-xl font-medium">Effective Date: August 1, 2024</p>

      <h2 className="pt-6 text-xl font-semibold">1. Introduction</h2>

      <p className="text-muted-foreground pt-4 text-base">
        Welcome to Vibe (“we”, “our”, “us”). We are committed to protecting your
        privacy and ensuring that your personal data is handled with the utmost
        care. This Privacy Policy outlines how we collect, use, and protect your
        information when you use our website and services.
      </p>

      <h2 className="pt-6 text-xl font-semibold">2. Information We Collect</h2>

      <ul className="text-muted-foreground list-inside list-disc pt-4">
        <li>
          Google Account Information: When you use our service, we collect your
          Google account name and profile picture to facilitate personalized
          access and enhance your user experience.
        </li>

        <li>
          User-Generated Data: We collect data that you provide to us, including
          any data you add on your profile or posts, which is stored on our
          platform.
        </li>
      </ul>

      <h2 className="pt-6 text-xl font-semibold">3. Use of Your Information</h2>

      <p className="text-muted-foreground pt-4 text-base">
        The information we collect is used solely for the purpose of providing
        and improving our services. Specifically, we use your data to:
      </p>

      <ul className="text-muted-foreground list-inside list-disc pt-4">
        <li>
          Enable you to access and use our services, including personalized
          features.
        </li>
        <li>Ensure the functionality of our website and services.</li>
      </ul>

      <h2 className="pt-6 text-xl font-semibold">
        4. Data Storage and Security
      </h2>

      <p className="text-muted-foreground pt-4 text-base">
        We implement appropriate technical and organizational measures to
        safeguard your data. Your information is stored securely and is
        accessible only to authorized personnel involved in maintaining and
        operating our services.
      </p>

      <h2 className="pt-6 text-xl font-semibold">
        5. Data Sharing and Disclosure
      </h2>

      <p className="text-muted-foreground pt-4 text-base">
        We do not share or disclose your personal data to third parties, except
        where required by law or in connection with a legal proceeding. Your
        information is used exclusively to enhance your experience with our
        service.
      </p>

      <h2 className="pt-6 text-xl font-semibold">6. User Rights</h2>

      <p className="text-muted-foreground pt-4 text-base">
        You have the right to:
      </p>

      <ul className="text-muted-foreground list-inside list-disc pt-4">
        <li>
          Access, update, or delete your personal data at any time by contacting
          us at the email address provided below.
        </li>
        <li>Withdraw your consent to data processing if applicable.</li>
      </ul>

      <h2 className="pt-6 text-xl font-semibold">
        7. Changes to This Privacy Policy
      </h2>

      <p className="text-muted-foreground pt-4 text-base">
        We may update this Privacy Policy from time to time to reflect changes
        in our practices or for other operational, legal, or regulatory reasons.
        We will notify you of any significant changes by posting the updated
        policy on our website.
      </p>

      <h2 className="pt-6 text-xl font-semibold">8. Contact Us</h2>

      <p className="text-muted-foreground pt-4 text-base">
        If you have any questions or concerns about this Privacy Policy or our
        data practices, please contact us at:
      </p>

      <p className="pb-8 pt-4 sm:pt-8">
        <span className="font-semibold">Vibe</span>
        <br />
        <Link href="mailto:ammar@ambe.dev" className="mt-2">
          ammar@ambe.dev
        </Link>
      </p>
    </main>
  );
}
