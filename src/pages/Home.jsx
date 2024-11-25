import {Graph} from "react-d3-graph";
import {toast} from "react-toastify";
import axios from "../api/axios";
import {useEffect, useState} from "react";
import Modal from "../components/Modal/Modal";

const Home = () => {
    const [data, setData] = useState({nodes: [], links:[]});
    const [focusedNodeId, setFocusedNodeId] = useState("");
    const [modalVisibility, setModalVisibility] = useState(false);

    useEffect(() => {
        try {
            axios.get("/v1/section/get-sections").then((response) => {
                console.log(response.data.subsections);
                if (response.data.subsections) {
                    const nodes = [];
                    const linkPromises = []; // Array to hold all link-fetching promises

                    response.data.subsections.map((el, index) => {
                        nodes.push({ id: el.id, name: el.name, symbolType : "circle", x: el.id*100+300,  y: (Math.random()*2-1)*30+400 });
                        if (el.next_section_id) {
                            const linkPromise = axios.get(`/v1/section/get-section-by-id?id=${el.next_section_id}`).then((resp) => {
                                if (resp.data.section) {
                                    return { source: el.id, target: resp.data.section.id };
                                }
                            });
                            linkPromises.push(linkPromise);
                            // linkPromises.push({source: el.id, target: el.next_section_id});
                        }
                    });
                    Promise.all(linkPromises).then((resolvedLinks) => {
                        const links = resolvedLinks.filter(link => link); // Filter out undefined results
                        setData({ nodes, links });
                        console.log(nodes);
                    });
                }
            });
        } catch (e) {
            toast.error("Не удалось загрузить секции!");
        }
    }, []);

    const myConfig = {
        nodeHighlightBehavior: true,
        panAndZoom: true,
        minZoom: 1,
        initialZoom: 2,
        zoom: 1,
        staticGraph: true,
        width: window.innerWidth/1,
        height: window.innerHeight/1.2,
        d3: {
            alphaTarget: 0.05,
            gravity: -400,
            linkLength: 180,
            linkStrength: 1,
            disableLinkForce: true
        },
        node: {
            color: "lightblue",
            fontSize: 14,
            highlightFontSize: 14,
            mouseCursor: "pointer",
            size: 700,
            highlightStrokeColor: "blue",
            labelProperty: "name",
        },
        link: {
            highlightColor: "lightblue",
        },
    };

    const onClickNode = function(nodeId) {
        setFocusedNodeId(nodeId);
        setModalVisibility(true);
    };

    const onClickLink = function(source, target) {
        toast(`Clicked link between ${source} and ${target}`);
    };

    const closeModal = function() {
        setModalVisibility(false);
    }

    return(
        <div className="container w-full overflow-hidden">
            <Graph
                id="roadmap"
                data={data}
                config={myConfig}
                onClickNode={onClickNode}
                onClickLink={onClickLink}
            />
            {
                modalVisibility &&
            <Modal nodeId={focusedNodeId} modalHeader="Секции данного этапа" hideModal={closeModal} />
            }
        </div>
    );
}

export default Home;
