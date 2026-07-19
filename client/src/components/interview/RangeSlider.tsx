import * as Slider from "@radix-ui/react-slider";
import type { RangeSliderProps } from "../../types/types";

const RangeSlider = ({ min, max, values, onChange }: RangeSliderProps) => {
    return (
        <div className="w-full">
            <div className="mb-2 flex items-center justify-between text-sm font-medium text-muted">
                <span>{values[0]}</span>
                <span>{values[1]}</span>
            </div>

            <Slider.Root
                className="relative flex h-5 w-full touch-none select-none items-center"
                min={min}
                max={max}
                step={2}
                value={values}
                onValueChange={onChange}
            >
                <Slider.Track className="relative h-2 grow rounded-full bg-border">
                    <Slider.Range className="absolute h-full rounded-full bg-primary-light" />
                </Slider.Track>

                <Slider.Thumb
                    className="
                        block h-5 w-5 rounded-full border-2 border-primary-light bg-background shadow-md
                        transition hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary-light/20
                    "
                />

                <Slider.Thumb
                    className="
                        block h-5 w-5 rounded-full border-2 border-primary-light bg-background shadow-md
                        transition hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary-light/20
                    "
                />
            </Slider.Root>
        </div>
    );
};

export default RangeSlider;
