interface Props {
  message: string;
}

export default function (props: Props) {
  throw new Error(`Assertion failed: ${props.message}`);
}
