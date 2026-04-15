import NodeGraphCanvas from "./node-graph"

export default function HeroScene() {
    return (
        <div className="absolute inset-0 -z-10">
            <div className="flex flex-col justify-center items-center h-full">
                <p className="text-lg">3D Canvas Coming Soon</p>
                <NodeGraphCanvas />
            </div>
        </div>
    )

}