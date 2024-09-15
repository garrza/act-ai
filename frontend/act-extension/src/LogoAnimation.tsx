import styles from './logoAnimation.module.css';

function LogoAnimation() {
  return (
    <svg className={styles.logo} width="320" height="80" viewBox="0 0 1024 512" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="Complete Logo Animation">
        <path
          className={styles.textVector}
          d="M484.545 356H454.727L552.636 169.818H585.091L621.182 356H591.364L564.182 203.636H562.727L484.545 356ZM501.636 283.091H598.364L594.364 306.727H497.636L501.636 283.091ZM814.591 230.364H786.773C786.652 224.303 785.53 218.97 783.409 214.364C781.288 209.697 778.379 205.788 774.682 202.636C771.045 199.424 766.773 197 761.864 195.364C756.955 193.727 751.652 192.909 745.955 192.909C734.985 192.909 724.682 195.697 715.045 201.273C705.409 206.848 697.197 214.97 690.409 225.636C683.621 236.303 678.955 249.303 676.409 264.636C673.924 279.545 674.227 292.061 677.318 302.182C680.409 312.303 685.621 319.97 692.955 325.182C700.348 330.333 709.227 332.909 719.591 332.909C725.652 332.909 731.561 332.121 737.318 330.545C743.136 328.909 748.53 326.515 753.5 323.364C758.47 320.212 762.864 316.364 766.682 311.818C770.561 307.212 773.591 301.939 775.773 296H803.955C800.924 305.212 796.652 313.636 791.136 321.273C785.621 328.909 779.106 335.515 771.591 341.091C764.076 346.667 755.833 350.97 746.864 354C737.894 357.03 728.409 358.545 718.409 358.545C701.985 358.545 687.985 354.636 676.409 346.818C664.894 338.939 656.621 327.727 651.591 313.182C646.621 298.636 645.773 281.303 649.045 261.182C652.379 241.606 658.742 224.818 668.136 210.818C677.591 196.758 689.106 186 702.682 178.545C716.318 171.03 731.045 167.273 746.864 167.273C756.864 167.273 766.015 168.697 774.318 171.545C782.621 174.333 789.773 178.455 795.773 183.909C801.833 189.303 806.5 195.909 809.773 203.727C813.045 211.485 814.652 220.364 814.591 230.364ZM845.295 194L849.295 169.818H993.386L989.386 194H931.295L904.386 356H876.386L903.295 194H845.295Z"
        />
        <path
          className={styles.mailIcon}
          d="M282.5 446H289.654C303.899 446 317.173 438.779 324.913 426.82L413.566 289.845C426.32 270.138 426.411 244.804 413.799 225.006L324.88 85.4333C317.169 73.3287 303.81 66 289.458 66H282.5M282.5 446L189.793 304.5M282.5 446H92.5M282.5 66L192 206.33M282.5 66H99.5M192 206.33L180.138 224.723C167.284 244.654 167.377 270.286 180.374 290.123L189.793 304.5M192 206.33L99.5 66M99.5 66H92C68.804 66 50 84.804 50 108V404C50 427.196 68.804 446 92 446H92.5M189.793 304.5L92.5 446"
        />
        </g>
    </svg>
  );
}

export default LogoAnimation;