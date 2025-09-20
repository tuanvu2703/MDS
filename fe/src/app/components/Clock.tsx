import { useEffect, useState } from "react";

export default function Clock() {
    const [time, setTime] = useState<Date>(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer); // cleanup khi unmount
    }, []);

    // Format theo ý muốn: dd/mm/yyyy hh:mm:ss
    const formatDate = (date: Date): string => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();


        return `${day}/${month}/${year}`;
    };
    const formatTime = (date: Date): string => {

        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");

        return ` ${hours}:${minutes}:${seconds}`;
    };

    return (
        <div className="grid justify-center items-center text-xl font-mono font-bold">
            <div>
                {formatDate(time)}
            </div>
            <div>
                {formatTime(time)}
            </div>
        </div>
    );
}
