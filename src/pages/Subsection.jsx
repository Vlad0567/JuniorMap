import {useNavigate, useParams} from "react-router-dom";
import {IoIosArrowBack} from "react-icons/io";
import {useContext, useEffect, useState} from "react";

const Subsection = () => {
    const params = useParams();
    const [subsectionId, setSubsectionId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if(params.id){
            console.log(params.id);
            setSubsectionId(params.id);
        }
    }, []);
    return(
        <div className="px-12">
            <h3 className="text-xl font-bold">Секция {subsectionId}</h3>

        </div>
    );
}

export default Subsection;
