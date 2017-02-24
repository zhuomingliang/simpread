console.log( "==== simpread component: Floating Action Button ====" )

let $target, type,
    style, styles = new Map();

const cssinjs = () => {
    const spec_color = 'rgba(244, 67, 54, 1)',
          normal_color= 'rgba(33, 150, 243, 1)',
          focus_color = 'rgba(198, 40, 40, 1)',
          styles      = {

              root : {
                display: '-webkit-box',
                WebkitBoxAlign: 'center',
                WebkitBoxOrient: 'vertical',
                WebkitBoxDirection: 'reverse',
                position: 'fixed',

                bottom: '45px',
                right: '24px',

                width: 'auto',
                height: 'auto',
              },

              origin : {
                display: 'block',
                position: 'relative',

                margin: '0 0 15px',
                padding: 0,

                width: '40px',
                height: '40px',
                lineHeight: '40px',

                color: '#fff',
                backgroundColor: normal_color,

                borderRadius: '50%',

                cursor: 'pointer',
                boxShadow: '0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2)',
              },

              large : {
                width: '56px',
                height: '56px',
                lineHeight: '56px',
              },

              spec: {},
              normal: {},

              spec_item : {
                backgroundColor: spec_color,
                transform: 'rotate(0deg)',
              },

              spec_focus : {
                  backgroundColor: focus_color,
                  transition: 'all 450ms 0ms',
                  transform: 'rotate(45deg)',
              },

              normal_focus : {
                  transition: 'all 450ms 0ms',
                  boxShadow: '0 3px 3px 0 rgba(0,0,0,0.14), 0 1px 7px 0 rgba(0,0,0,0.12), 0 3px 1px -1px rgba(0,0,0,0.2)',
              },

              spec_icon: {},
              normal_icon: {},

              icon : {
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
              },

              anchor_icon : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAANElEQVQ4T+3GMQ0AIAwAMAwSEvwLACai3HtmAHq1te8xpnCM6okAu3rigFU9MWxLr/695AI0E1VgH26hCQAAAABJRU5ErkJggg==',

              ul : {
                display: '-webkit-flex',
                position: 'initial',
                flexFlow: 'column nowrap',

                listStyle: 'none',

                padding: 0,
                margin: 0,

                opacity: 0,
                transition: 'opacity .5s ease',
              },

              li : {
                  margin: 0,
              },

              ul_hori: {
                display: '-webkit-flex',
                position: 'absolute',

                flexFlow: 'row nowrap',
                listStyle: 'none',

                right: '48px',
              },

              li_hori : {
                  margin: '0 15px 0 0',
              },

          };
    return styles;
};

const Button = ( props ) => {
    props.icon[0].backgroundImage = `url(${props.icon[1]})`;
    if ( props.color ) {
        props.style.backgroundColor = props.color;
    } else {
        props.color = props.style.backgroundColor;
    }
    return (
        <a style={ props.style }>
            <i 
                id={ props.id }
                type={ props.type }
                name={ props.name }
                color={ props.color }
                style={ props.icon[0] }
                onClick={ ()=>props.onClick() }
                onMouseOver={ ()=> props.onMouseOver() }
                onMouseOut={ ()=> props.onMouseOut() }
            ></i>
        </a>
    )
};

export default class Fab extends React.Component {

    static defaultProps = {
        items : {},
    }

    static propTypes = {
        items    : React.PropTypes.object,
        onAction : React.PropTypes.func,
    }

    state = {
        id : Math.round(+new Date()),
    }

    clickHandler() {
        const type = $( event.target ).attr( "id" );
        if ( this.props.onAction ) this.props.onAction( event, type );
    }

    mouseOverHandler() {
        style = styles.get( this.state.id );
        $target = $( event.target );
        type    = $target.attr( "type" );
        if ( type == "spec" ) {
            $target.parent().css({ ...style.spec, ...style.spec_focus });
        } else {
            $target.parent().css({ ...style.normal, ...style.normal_focus });
            if ( $target.parent().next() && $target.parent().next().is( "ul" ) ) {
                $target.parent().next().css( "opacity", 1 );
            }
        }
    }

    mouseOutHandler() {
        style = styles.get( this.state.id );
        $target = $( event.target );
        type    = $target.attr( "type" );
        const color = $target.attr( "color" );
        if ( type == "spec" ) {
            $target.parent().css({ ...style.origin, ...style.large, ...style.spec_item });
        } else {
            if ( color ) style.origin.backgroundColor = color;
            $target.parent().css({ ...style.origin });
        }
    }

    fabMouseOutHandler() {
        $target = $( event.target );
        while( !$target.is( "fab" ) ) {
            $target = $target.parent();
        }
        $target.find( "ul" ).css( "opacity", 0 );
    }

    liMouseLeaveHandler() {
        $target = $( event.target );
        type    = $target.attr( "type" );
        if ( $target.is( "i" ) ) {
            $target.parent().next().css( "opacity", 0 );
        } else if ( $target.is( "li" ) ) {
            $target.find("ul").css( "opacity", 0 );
        }
    }

    componentDidMount() {
        const $root = $( "fab" );
        const $ul   = $($root.children()[2]);
        if ( $ul.is("ul") ) {
            $ul.children().map( ( idx, item )=> {
                const $ul = $(item).find( "ul" );
                if ( $ul ) $ul.css( "top", `${idx * $ul.height()}px` );
            })
        }
    }

    render() {
        styles.set( this.state.id, cssinjs() );
        style = styles.get( this.state.id );

        const props = ( obj, id, type, style, icon_style, idx )=> {
            return {
                id,
                type,
                style,
                name       : obj.name,
                color      : obj.color,
                icon       : [ icon_style, obj.icon ],
                onClick    : ()=>this.clickHandler(),
                onMouseOver: ()=>this.mouseOverHandler(),
                onMouseOut : ()=>this.mouseOutHandler(),
            };
        };

        const sublist = ( obj, key, style, idx ) => {
            return (
                <li style={ style.li_hori } onMouseLeave={ ()=> this.liMouseLeaveHandler() }>
                    <Button { ...props( obj, key, "normal", style.origin, style.icon, idx ) } />
                </li>
            )
        }

        let keys, spec, anchor, others = [];

        keys = Object.keys( this.props.items );
        if ( keys.length > 1 ) {
            keys.splice( 1, 0, "anchor" );
            this.props.items[ "anchor" ] = {
                "name" : "更多",
                "icon" : style.anchor_icon,
            }
            anchor = <Button { ...props( this.props.items[keys[1]], keys[1], "anchor", style.origin, style.icon, 1 ) } />;
        }

        if ( keys.length > 0 ) {
            style.spec = { ...style.origin, ...style.large, ...style.spec_item };
            spec = <Button { ...props( this.props.items[keys[0]], keys[0], "spec", style.spec, style.icon, 0 ) } />;
        }

        for( let idx = keys.length - 1; idx >= 2; idx-- ) {

            const child = [];
            const subitem = this.props.items[ keys[idx] ].items;
            if ( subitem ) {
                const subkeys = Object.keys( subitem );
                for ( let j = 0; j < subkeys.length; j++ ) {
                    child.push(
                        sublist( subitem[subkeys[j]], subkeys[j], style , j )
                    )
                }
            }

            const list = (
                <li style={ style.li } onMouseLeave={ ()=> this.liMouseLeaveHandler() }>
                    <Button { ...props( this.props.items[keys[idx]], keys[idx], "normal", style.origin, style.icon, idx ) } />
                    <ul style={{ ...style.ul, ...style.ul_hori }}>
                        { child }
                    </ul>
                </li>
            )
            others.push( list );
        }
        if ( others.length > 0 ) {
            others = ( <ul style={ style.ul }>{ others }</ul> );
        }

        return (
            <fab style={ style.root } onMouseLeave={ ()=>this.fabMouseOutHandler() }>
                { spec   }
                { anchor }
                { others }
            </fab>
        )
    }

}