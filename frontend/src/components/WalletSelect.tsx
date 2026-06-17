import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, X } from "lucide-react";
import { getAllWallets } from "../api/WalletApi";
import type { WalletType } from "../types/WalletTypes";

interface WalletSelectProps {
    value: string;
    onChange: (address: string) => void;
    excludeAddress?: string;
    disabled?: boolean;
}

export default function WalletSelect({ value, onChange, excludeAddress, disabled }: WalletSelectProps) {
    const [wallets, setWallets] = useState<WalletType[]>([]);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [highlighted, setHighlighted] = useState(-1);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    const selected = wallets.find(w => w.address === value);

    const filtered = wallets.filter(w =>
        w.username.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        let cancelled = false;

        async function fetchWallets() {
            try {
                setIsPending(true);
                setError(null);
                const data = await getAllWallets();
                if (!cancelled) {
                    setWallets(data.filter(w => w.address !== excludeAddress));
                }
            } catch (e) {
                if (!cancelled) {
                    setError(e instanceof Error ? e : new Error("Error al cargar wallets"));
                }
            } finally {
                if (!cancelled) {
                    setIsPending(false);
                }
            }
        }

        fetchWallets();

        return () => { cancelled = true; };
    }, [excludeAddress]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (popoverRef.current?.contains(e.target as Node)) return;
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const recalcCoords = () => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setCoords({ top: rect.bottom + 4, left: rect.left, width: rect.width });
        }
    };

    const openDropdown = () => {
        if (disabled) return;
        recalcCoords();
        setSearch("");
        setHighlighted(-1);
        setOpen(true);
    };

    const selectOption = (option: WalletType) => {
        onChange(option.address);
        setSearch("");
        setHighlighted(-1);
        setOpen(false);
        inputRef.current?.blur();
    };

    const clearValue = () => {
        onChange("");
        setSearch("");
        setHighlighted(-1);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!open) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlighted(prev => Math.min(prev + 1, filtered.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlighted(prev => Math.max(prev - 1, 0));
        } else if (e.key === "Enter" && highlighted >= 0) {
            e.preventDefault();
            selectOption(filtered[highlighted]);
        }
    };

    useEffect(() => {
        if (highlighted >= 0 && listRef.current) {
            const item = listRef.current.children[highlighted] as HTMLElement;
            item?.scrollIntoView({ block: "nearest" });
        }
    }, [highlighted]);

    useEffect(() => {
        if (open) recalcCoords();
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const handleScroll = () => setOpen(false);
        document.addEventListener("scroll", handleScroll, { capture: true, passive: true });
        return () => document.removeEventListener("scroll", handleScroll, { capture: true });
    }, [open]);

    return (
        <div ref={containerRef} className="relative w-full">
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={open ? search : selected ? `${selected.username} — ${selected.address}` : ""}
                    placeholder="Seleccionar wallet..."
                    onFocus={openDropdown}
                    onChange={(e) => {
                        if (!open) openDropdown();
                        setSearch(e.target.value);
                        setHighlighted(-1);
                    }}
                    onKeyDown={handleKeyDown}
                    readOnly={!open && !!selected}
                    className={`
                        input w-full bg-white/5 border-white/10 pr-10
                        text-white/80 placeholder:text-white/20
                        focus:border-emerald-500/30 focus:outline-none transition-all
                        cursor-pointer
                    `}
                />

                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                    {selected && !open && (
                        <button
                            type="button"
                            tabIndex={-1}
                            onMouseDown={(e) => { e.stopPropagation(); clearValue(); }}
                            className="pointer-events-auto text-white/30 hover:text-white/60 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    )}
                    <ChevronDown
                        size={16}
                        className={`text-white/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    />
                </div>
            </div>

            {isPending && (
                <div className="flex items-center gap-2 mt-2">
                    <span className="loading loading-spinner loading-xs text-emerald-400"></span>
                    <span className="text-xs text-white/40">Cargando wallets...</span>
                </div>
            )}

            {error && (
                <div className="mt-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/10 text-red-400 text-xs">
                    {error.message}
                </div>
            )}

            {!isPending && wallets.length === 0 && !error && (
                <div className="text-xs text-white/40 mt-2">No hay wallets disponibles</div>
            )}

            {open && !isPending && createPortal(
                <div
                    ref={popoverRef}
                    className="fixed z-[9999] rounded-xl border border-white/10 bg-[#161a23] shadow-xl overflow-hidden"
                    style={{ top: coords.top, left: coords.left, width: coords.width }}
                >
                    {filtered.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-white/40">
                            No se encontraron wallets
                        </div>
                    ) : (
                        <ul ref={listRef} className="max-h-48 overflow-y-auto py-1">
                            {filtered.map((w, i) => {
                                const isSelected = w.address === value;
                                return (
                                    <li
                                        key={w.address}
                                        onClick={() => selectOption(w)}
                                        onMouseEnter={() => setHighlighted(i)}
                                        className={`
                                            px-4 py-2.5 text-sm cursor-pointer transition-colors border-b border-white/5 last:border-b-0
                                            ${highlighted === i
                                                ? "bg-emerald-500/10 text-emerald-400"
                                                : isSelected
                                                    ? "text-emerald-400 font-medium"
                                                    : "text-white/70 hover:bg-white/5"
                                            }
                                        `}
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-white/80">{w.username}</span>
                                            <span className="text-xs text-white/30 font-mono truncate mt-0.5">{w.address}</span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>,
                document.body
            )}
        </div>
    );
}
