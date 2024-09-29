import { Switch, SwitchProps } from "@material-tailwind/react";

export function Switcher({ ...rest }: SwitchProps) {
  return (
    <Switch
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
      crossOrigin={undefined}
      color="blue"
      {...rest}
    />
  );
}
