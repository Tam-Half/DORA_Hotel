import star from "../../assets/icons/star.png";
import heart from "../../assets/icons/heart.png";

export default function GeneralInfoRoom({ room }) {
  if (!room) return null;

  return (
    <div className="h-fit rounded-xl flex justify-between pt-18">
      <div className="w-3/4">
        <h2 className="text-3xl font-bold ">{room?.name}</h2>
      </div>
    </div>
  );
}
