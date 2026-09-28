// Precedence level could be used to combine styles by piece of code (add more in case if you see other parts)
// Would be sorted in order of appearance so we have to support following order in components tree
// base => layout => features => components  
export type Precedence = 'base' | 'layout' | 'features' | 'components';

export interface StylesheetProps {
    href: string;
    precedence?: Precedence;
}

// Needs only to keep precedence for now
export function Stylesheet({ href, precedence = 'components' }: StylesheetProps) {
    return <link rel="stylesheet" href={href} precedence={precedence} />;
}
