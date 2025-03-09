"use client";

const UnsubscribedCard = () => {
  const isPaid = false;

  return (
    <>
      {isPaid ? null : (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-black">
            <h3 className="mb-4 text-xl font-bold dark:text-white">
              Deploy to Vercel
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Your portfolio will be automatically deployed to Vercel&aposs
              global edge network.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default UnsubscribedCard;
