const Badge = ({ text } : {text: string}) => {
  return (
    <div className="mb-6 flex justify-center">
      <div className="rounded-full border  bg-white/10 backdrop-blur-md border-white/20 px-4 py-2 text-sm text-white font-medium">
        {text}
      </div>
    </div>
  );
};

export default Badge;