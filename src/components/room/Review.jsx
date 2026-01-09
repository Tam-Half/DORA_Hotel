import Star from "../../assets/icons/star.png"
export default function Review({ url, username, description, date }) {
  return (
    <div className="flex  gap-2 border-2 rounded-lg p-2 bg-white flex-col h-fit w-full ">
      <div className="flex justify-row  w-full p-1">
        <div className="w-[40px] h-[40px] rounded-[50%] ">
          <img src={url} className="w-full h-full object-cover rounded-[50%]" />
        </div>
        <div className="flex flex-col ml-2 w-44 border-2">
          <span className="text-sm">{username}</span>
          <span> {date}</span>
        </div>
        <div className="w-fit border-2 self-center justify-self-start flex justify-end ml-14">
          <span className="mr-2 text-gray-600 text-sm">3.8</span>
          <img src={Star} alt="" className="w-[25px] h-[25px]" />
        </div>
      </div>

      <div className="w-full break-words whitespace-normal">
        <span className="block text-sm text-gray-700">
          {description}
        </span>
      </div>
    </div>
  );
}
