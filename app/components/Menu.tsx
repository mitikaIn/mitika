import Dropdown from "@/components/Dropdown.vue";
import { PhDotsThreeVertical } from "@phosphor-icons/vue";
import { type SetupContext, cloneVNode } from "vue";

// 1rem = 16px
// spacing = 0.25rem
// padding = 1rem
// border = 1px
//
// btnWidth = 2 * border + 2 * padding + spacing * btnSize
//          = 2 * 1px + 2 * 1rem  + 0.25rem * btnSize
//          = 2px + 2rem + 0.25rem * btnSize
//          = 0.125rem + 2rem + 0.25rem * btnSize
//          = 2.125rem + 0.25rem * btnSize
//
// i >= 0
// width = (btnWidth + spacing * gap) * i - (spacing * gap)
//       = (2.125rem + 0.25rem * btnSize + spacing * gap) * i - (spacing * gap)
//       = space for i buttons.

// btnSize = 4
// gap = 2
//
// btnWidth = 2.125rem + 0.25rem * btnSize
//          = 2.125rem + 0.25rem * 4
//          = 2.125rem + 1rem
//          = 3.125rem
//
// width = (btnWidth + spacing * gap) * i - (spacing * gap)
//       = (3.125rem + 0.25rem * 2) * i - (0.25rem * 2)
//       = (3.125rem + 0.5rem) * i - (0.5rem)
//       = (3.625rem) * i - 0.5rem
const WIDTHS_4_2_IN_DROPDOWN = [
  "@min-[03.125rem]:hidden flex",
  "@min-[06.750rem]:hidden flex",
  "@min-[10.375rem]:hidden flex",
  "@min-[14.000rem]:hidden flex",
  "@min-[17.625rem]:hidden flex",
  "@min-[21.250rem]:hidden flex",
  "@min-[24.875rem]:hidden flex",
  "@min-[28.500rem]:hidden flex",
  "@min-[32.125rem]:hidden flex",
  "@min-[35.750rem]:hidden flex",
  "@min-[39.375rem]:hidden flex",
  "@min-[43.000rem]:hidden flex",
  "@min-[46.625rem]:hidden flex",
  "@min-[50.250rem]:hidden flex",
];
const WIDTHS_4_2_NOT_IN_DROPDOWN = [
  "@min-[03.125rem]:flex hidden",
  "@min-[06.750rem]:flex hidden",
  "@min-[10.375rem]:flex hidden",
  "@min-[14.000rem]:flex hidden",
  "@min-[17.625rem]:flex hidden",
  "@min-[21.250rem]:flex hidden",
  "@min-[24.875rem]:flex hidden",
  "@min-[28.500rem]:flex hidden",
  "@min-[32.125rem]:flex hidden",
  "@min-[35.750rem]:flex hidden",
  "@min-[39.375rem]:flex hidden",
  "@min-[43.000rem]:flex hidden",
  "@min-[46.625rem]:flex hidden",
  "@min-[50.250rem]:flex hidden",
];

// btnSize = 4
// gap = 4
//
// btnWidth = 2.125rem + 0.25rem * btnSize
//          = 2.125rem + 0.25rem * 4
//          = 2.125rem + 1rem
//          = 3.125rem
//
// width = (btnWidth + spacing * gap) * i - (spacing * gap)
//       = (3.125rem + 0.25rem * 4) * i - (0.25rem * 4)
//       = (3.125rem + 1rem) * i - (1rem)
//       = (4.125rem) * i - 1rem
const WIDTHS_4_4_IN_DROPDOWN = [
  "flex",
  "@min-[03.125rem]:hidden flex",
  "@min-[07.250rem]:hidden flex",
  "@min-[11.375rem]:hidden flex",
  "@min-[15.500rem]:hidden flex",
  "@min-[19.625rem]:hidden flex",
  "@min-[23.750rem]:hidden flex",
  "@min-[27.875rem]:hidden flex",
  "@min-[32.000rem]:hidden flex",
  "@min-[36.125rem]:hidden flex",
  "@min-[40.250rem]:hidden flex",
  "@min-[44.375rem]:hidden flex",
  "@min-[48.500rem]:hidden flex",
  "@min-[52.625rem]:hidden flex",
  "@min-[56.750rem]:hidden flex",
];

const WIDTHS_4_4_NOT_IN_DROPDOWN = [
  "hidden",
  "@min-[03.125rem]:flex hidden",
  "@min-[07.250rem]:flex hidden",
  "@min-[11.375rem]:flex hidden",
  "@min-[15.500rem]:flex hidden",
  "@min-[19.625rem]:flex hidden",
  "@min-[23.750rem]:flex hidden",
  "@min-[27.875rem]:flex hidden",
  "@min-[32.000rem]:flex hidden",
  "@min-[36.125rem]:flex hidden",
  "@min-[40.250rem]:flex hidden",
  "@min-[44.375rem]:flex hidden",
  "@min-[48.500rem]:flex hidden",
  "@min-[52.625rem]:flex hidden",
  "@min-[56.750rem]:flex hidden",
];

const WIDTHS = {
  4: {
    2: { 1: WIDTHS_4_2_IN_DROPDOWN, 0: WIDTHS_4_2_NOT_IN_DROPDOWN },
    4: { 1: WIDTHS_4_4_IN_DROPDOWN, 0: WIDTHS_4_4_NOT_IN_DROPDOWN },
  },
};

interface Props {
  btnSize: 4;
  dropdownClass?: string;
  expandDir?: "start" | "end";
  gap: 2 | 4;
  menuClass?: string;
}

// Dropdown must be shown by default but hidden when there is space of all children.
function getDropdownClass(len: number, btnSize: Props["btnSize"], gap: Props["gap"]): string {
  const widths = WIDTHS[btnSize][gap][1];
  return widths[len]!;
}

// Using 5 as len
// idx -> must be shown when there is space for N elements; how many children + 1 dropdown
//
// expandDir: start
// 0 -> 5; 5 children + 0 dropdown
// 1 -> 5; 4 children + 1 dropdown = 5 children; instead of showing dropdown, show 5th child.
// 2 -> 4; 3 children + 1 dropdown
// 3 -> 3; 2 children + 1 dropdown
// 4 -> 2; 1 children + 1 dropdown
//
// expandDir: end
// 0 -> 2; 1 children + 1 dropdown
// 1 -> 3; 2 children + 1 dropdown
// 2 -> 4; 3 children + 1 dropdown
// 3 -> 5; 4 children + 1 dropdown = 5 children; instead of showing dropdown, show 5th child.
// 4 -> 5; 5 children + 0 dropdown
function getItemClass(
  idx: number,
  len: number,
  btnSize: Props["btnSize"],
  expandDir: Props["expandDir"],
  gap: Props["gap"],
  inDropdown: boolean,
): string {
  let i;
  if (expandDir == "start") i = idx == 0 ? len : len + 1 - idx;
  else i = idx == len - 1 ? len : idx + 2;
  const widths = WIDTHS[btnSize][gap][inDropdown ? 1 : 0];
  if (widths.length < i)
    throw new Error(`Unsupported index: ${i} with widths length: ${widths.length}`);
  return widths[i]!;
}

export default function Menu(props: Props, context: SetupContext<{}>) {
  const {
    btnSize,
    dropdownClass = "",
    expandDir = "end",
    gap,
    menuClass = "bg-base-200 rounded-box shadow-md min-w-64",
  } = props;
  const children = context.slots.default?.() || [];

  const menu = (
    <li>
      <Dropdown
        buttonClassName={`btn-ghost ${getDropdownClass(children.length, btnSize, gap)}`}
        dropdownClassName={dropdownClass}
      >
        {{
          button: () => <PhDotsThreeVertical class="size-6" />,
          content: () => (
            <ul class={["menu", menuClass]}>
              {children.map((child, i) =>
                cloneVNode(child, {
                  class: getItemClass(i, children.length, btnSize, expandDir, gap, true),
                  inDropdown: true,
                }),
              )}
            </ul>
          ),
        }}
      </Dropdown>
    </li>
  );

  return (
    <ul class="@container flex flex-row">
      {expandDir == "start" ? menu : null}
      {children.map((child, i) =>
        cloneVNode(child, {
          class: getItemClass(i, children.length, btnSize, expandDir, gap, false),
        }),
      )}
      {expandDir == "end" ? menu : null}
    </ul>
  );
}
