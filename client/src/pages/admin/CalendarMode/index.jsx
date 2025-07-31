import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import Text from "@/components/Text";
import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import { useAuth } from "@/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import Timeline from "react-calendar-timeline";
import 'react-calendar-timeline/dist/style.css'
import { endOfMonth, startOfMonth } from "date-fns";

export function CalendarMode() {
  const [groups, setGroups] = useState([]);
  const [items, setItems] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 7);
  });
  const monthStart = new Date(`2025-07-01T00:00:00`);
  const monthEnd = endOfMonth(monthStart);

  useEffect(() => {
    (async () => {
      const now = new Date();
      const month = now.toISOString().slice(0, 7);

      const result = await apiRequest(`/calendar`, {
        method: "GET",
      });

      const convertedItems = result.items.map(item => ({
        ...item,
        start_time: new Date(item.start_time).getTime(),
        end_time: new Date(item.end_time).getTime(),
      }));

      setGroups(result.groups);
      setItems(convertedItems);
    })()
  }, []);

  const itemRenderer = ({ item, timelineContext, itemContext, getItemProps, getResizeProps }) => {
    const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
    const backgroundColor = itemContext.selected ? (itemContext.dragging ? "red" : item.selectedBgColor) : item.bgColor;
    const borderColor = itemContext.resizing ? "red" : item.color;
    return (
      <div
        {...getItemProps({
          style: {
            backgroundColor,
            color: item.color,
            borderColor,
            borderStyle: "solid",
            borderWidth: 1,
            borderRadius: 6,
            fontSize: '14px',
            borderLeftWidth: itemContext.selected ? 3 : 1,
            borderRightWidth: itemContext.selected ? 3 : 1
          },
          onMouseDown: () => {
            console.log("on item click", item);
          }
        })}
      >
        {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : null}

        <div
          style={{
            height: itemContext.dimensions.height,
            overflow: "hidden",
            paddingLeft: 3,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          {itemContext.title}
        </div>

        {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : null}
      </div>
    );
  };

  return (
    <section className="flex w-full p-20 justify-between overflow-y-auto overflow-x-hidden">
      <section className="w-full">
        <GlobalBreadcrumb />
        <div className="flex gap-12 items-end mb-8">
          <Text heading={'h1'}>Calendário</Text>
        </div>
        <section>
          <Timeline
            groups={groups}
            items={items}
            defaultTimeStart={monthStart.getTime()}
            defaultTimeEnd={monthEnd.getTime()}
            canMove={false}
            canResize={false}
            itemTouchSendsClick={false}
            itemHeightRatio={1}
            itemRenderer={itemRenderer}
          />
        </section>
      </section>
    </section>
  )
}