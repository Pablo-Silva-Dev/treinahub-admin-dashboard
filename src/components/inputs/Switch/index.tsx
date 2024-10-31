import { Switch, SwitchProps } from "@material-tailwind/react";

export function Switcher({ ...rest }: SwitchProps) {
  return (
    <Switch
      crossOrigin={undefined}
      color="blue"
      {...rest}
    />
  );
}
