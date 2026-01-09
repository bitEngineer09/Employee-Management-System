import React from 'react';
import styled from 'styled-components';

const COLOR_MAP = {
    checkin: {
        front: 'hsl(145deg 63% 42%)',       // green
        edgeDark: 'hsl(145deg 63% 20%)',
        edgeLight: 'hsl(145deg 63% 35%)',
    },
    checkout: {
        front: 'hsl(210deg 90% 55%)',       // blue
        edgeDark: 'hsl(210deg 90% 30%)',
        edgeLight: 'hsl(210deg 90% 45%)',
    }
};

const ButtonClicky = ({ buttonFnName, method, isLoading, variant = 'checkin' }) => {
    const colors = COLOR_MAP[variant];

    return (
        <StyledWrapper colors={colors}>
            <button onClick={method} disabled={isLoading}>
                <span className="shadow" />
                <span className="edge" />
                <span className="front text">
                    {buttonFnName}
                </span>
            </button>
        </StyledWrapper>
    );
};

export default ButtonClicky;

const StyledWrapper = styled.div`
  button {
    position: relative;
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
    outline-offset: 4px;
    transition: filter 250ms;
    user-select: none;
    touch-action: manipulation;
  }

  .shadow {
    position: absolute;
    inset: 0;
    border-radius: 12px;
    background: hsl(0deg 0% 0% / 0.25);
    transform: translateY(2px);
    transition: transform 600ms cubic-bezier(.3, .7, .4, 1);
  }

  .edge {
    position: absolute;
    inset: 0;
    border-radius: 12px;
    background: linear-gradient(
      to left,
      ${({ colors }) => colors.edgeDark} 0%,
      ${({ colors }) => colors.edgeLight} 8%,
      ${({ colors }) => colors.edgeLight} 92%,
      ${({ colors }) => colors.edgeDark} 100%
    );
  }

  .front {
    display: block;
    position: relative;
    padding: 12px 27px;
    border-radius: 12px;
    font-size: 1.1rem;
    color: white;
    background: ${({ colors }) => colors.front};
    transform: translateY(-4px);
    transition: transform 600ms cubic-bezier(.3, .7, .4, 1);
  }

  button:hover {
    filter: brightness(110%);
  }

  button:hover .front {
    transform: translateY(-6px);
    transition: transform 250ms cubic-bezier(.3, .7, .4, 1.5);
  }

  button:active .front {
    transform: translateY(-2px);
    transition: transform 34ms;
  }

  button:hover .shadow {
    transform: translateY(4px);
  }

  button:active .shadow {
    transform: translateY(1px);
  }
`;
