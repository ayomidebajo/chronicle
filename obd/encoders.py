from obdio.encoder import OBDEncoder
import obd
import copy


class CustomOBDEncoder(OBDEncoder):
    """Custom OBD encoder to typecast float and int to string."""

    def default(self, o):
        default_ret = super().default(o)

        if isinstance(o, obd.OBDResponse):
            if o.is_null():
                return None
            else:
                return {
                    'value': str(o.value.magnitude),
                    'command': o.command,
                    'time': int(o.time * 1000),
                    'unit': o.unit
                }
        
        else:
            return default_ret
