import React, {useEffect, useState} from 'react';
import './Modal.css';
import axios from "../../api/axios";
import Badge from "../UI/Badge";
import {Link} from "react-router-dom";

const Modal = ({nodeId, modalHeader, hideModal}) => {

    const [subsections, setSubsections] = useState([])

    useEffect(() => {
        if (nodeId){
            console.log(nodeId);
            try {
                axios.get(`/v1/subsection/get-subsections-by-section-id?sectionId=${nodeId}`).then((response) => {
                    if (response.status === 200) {
                        console.log(response.data.subsections);
                        setSubsections(response.data.subsections);
                    }

                });
            } catch (e) {
                console.log('axios error', e);
            }
        }
    }, [nodeId]);

    return (
        <div id="default-modal" tabIndex="-1" aria-hidden="true"
             className="overflow-y-visible overflow-x-hidden fixed flex align-middle z-10 justify-center items-center w-full md:inset-0 h-[calc(100%+1rem)] max-h-full bg-gray-800 bg-opacity-30">
            <div className="relative p-4 w-full max-w-2xl max-h-full z-50  mx-auto my-auto">

                <div className="relative bg-gray-800 rounded-lg shadow align-middle justify-center drop-shadow-xl">

                    <div
                        className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl text-gray-100 font-bold">
                            {modalHeader}
                        </h3>
                        <button type="button"
                                onClick={hideModal}
                                className="text-gray-100 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                data-modal-hide="default-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>

                    <div className="p-4 md:p-5 space-y-4">
                        {
                            subsections.map((el) => {
                                return (
                                    <Link key={el.id} to={"/subsection/" + el.id} className="toSub">
                                    <button className="text-base p-3 align-middle leading-relaxed text-gray-100 z-50 w-full rounded-md hover:bg-gray-700">
                                        { (el.status === 0) ?
                                            <Badge content="" /> : null
                                            } {el.name}
                                    </button>
                                    </Link>
                                );
                            })
                        }
                    </div>

                    <div
                        className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                    </div>
                </div>
            </div>
        </div>);
};

export default Modal;
