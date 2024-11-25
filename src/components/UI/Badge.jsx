const Badge = ({content}) =>{
return (
    <span
        className="inline-flex items-center justify-center align-middle w-4 h-4 ms-2 me-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
{content}
</span>
);
}

export default Badge;
