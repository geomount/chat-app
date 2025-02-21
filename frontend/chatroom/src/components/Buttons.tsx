interface InputI {
    disabled: boolean,
    children: any,
    onClick: any,
    variant: any
}
export const Button: any = ({
    disabled,
    children,
    onClick,
    variant
}: InputI) => {
    // clsx, cx
    console.log(disabled);
    return <span onClick={onClick} className={`rounded-2xl text-2xl px-4 py-4 text-white cursor-pointer bg-blue-200 hover:bg-green-400`}>
        {children}
    </span>
}