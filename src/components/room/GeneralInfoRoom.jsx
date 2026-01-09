import star from "../../assets/icons/star.png";
import heart from "../../assets/icons/heart.png";
export default function RoomGallery() {
  return (
    <div className="h-fit rounded-xl  flex justify-between p-4 ">
        <div className=" w-3/4 ">
            <h2 className="text-3xl font-bold p-2">Delux Ocean View Suite</h2>
           
            <div className="flex w-2/3  text-xs justify-between p-2">
                 <span>Vung Tau, Viet Nam - Cach Bien 200m</span>
                
                <div className="flex w-1/3 gap-1 items-center ">
                    <img src={star} alt=""  className="w-4"/>
                    <span className="font-bold">4.9</span>
                    <span>(128 đánh giá)</span>
                </div>
                
            </div>
        </div>
        <div className="w-fit h-fit mt-3"><button
  className="
    border-1 border-gray-300 mt-3 flex w-16 p-2 text-xs justify-between rounded-md font-medium
    transition
    active:scale-95
    active:bg-gray-200
  "
>
  <img src={heart} alt="" className="w-4" />
  Lưu
</button></div>
    </div>
  )
}
